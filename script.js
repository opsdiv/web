const textElement = document.getElementById("text-overlay-change");
const textList = ["Analytics", "Reporting", "Project Management", "Program Management"];
const colorList = ["43A047", "8963BA", "E22954", "E6CE60"]
let timeoutId;

const cycleText = () => {
  textElement.textContent = textList[Math.floor(Math.random() * textList.length)]; // Choose random element.
  textElement.style.color = colorList[Math.floor(Math.random() * colorList.length)]; // Choose random element.
  clearTimeout(timeoutId);
  timeoutId = setTimeout(cycleText, 3000);
};
