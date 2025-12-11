document.addEventListener("mousemove", () => {
  document.querySelectorAll("*").forEach(el => {
    if (el.scrollWidth > el.clientWidth) {
      el.style.outline = "2px solid red";
    }
  });
});
