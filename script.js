const grid = document.querySelector(".calendar__grid");
const title = document.querySelector(".calendar__title");
const toggleButtons = document.querySelectorAll(".toggle");
const navButtons = document.querySelectorAll(".nav");

const lunarFormatter = new Intl.DateTimeFormat("ko-KR-u-ca-chinese", {
  month: "numeric",
  day: "numeric",
});

let mode = "solar";
let current = new Date();

const formatLunar = (date) => {
  const parts = lunarFormatter.formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${month}.${day}`;
};

const updateTitle = () => {
  title.textContent = `${current.getFullYear()}년 ${current.getMonth() + 1}월`;
};

const renderCalendar = () => {
  grid.innerHTML = "";
  updateTitle();

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = 42;

  for (let i = 0; i < totalCells; i += 1) {
    const cell = document.createElement("div");
    cell.className = "day";

    const dayNumber = i - startDay + 1;
    let date;

    if (dayNumber <= 0) {
      const prevDate = daysInPrevMonth + dayNumber;
      date = new Date(year, month - 1, prevDate);
      cell.classList.add("day--muted");
    } else if (dayNumber > daysInMonth) {
      const nextDate = dayNumber - daysInMonth;
      date = new Date(year, month + 1, nextDate);
      cell.classList.add("day--muted");
    } else {
      date = new Date(year, month, dayNumber);
      cell.classList.add("day--highlight");
    }

    const solar = document.createElement("span");
    solar.className = "day__solar";
    solar.textContent = date.getDate();

    const lunar = document.createElement("span");
    lunar.className = "day__lunar";
    lunar.textContent = `음력 ${formatLunar(date)}`;

    cell.append(solar, lunar);

    if (mode === "lunar") {
      cell.classList.add("day--lunar");
    }

    grid.appendChild(cell);
  }
};

const setMode = (nextMode) => {
  mode = nextMode;
  toggleButtons.forEach((button) => {
    const pressed = button.dataset.mode === nextMode;
    button.setAttribute("aria-pressed", pressed.toString());
  });
  renderCalendar();
};

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
  });
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    current = new Date(
      current.getFullYear(),
      current.getMonth() + (action === "next" ? 1 : -1),
      1
    );
    renderCalendar();
  });
});

renderCalendar();
