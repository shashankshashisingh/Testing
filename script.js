(function () {
  "use strict";

  var RATE_INVESTED = 0.07;
  var RATE_CASH = 0.02;

  var amountInput = document.getElementById("amount");
  var yearsInput = document.getElementById("years");
  var yearsOut = document.getElementById("years-out");
  var chart = document.getElementById("chart");
  var outInvested = document.getElementById("out-invested");
  var outCash = document.getElementById("out-cash");

  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var compact = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

  var firstDraw = true;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function value(start, rate, year) {
    return start * Math.pow(1 + rate, year);
  }

  function niceMax(max) {
    var step = Math.pow(10, Math.floor(Math.log10(max))) / 2;
    return Math.ceil(max / step) * step;
  }

  function readAmount() {
    var n = parseFloat(amountInput.value);
    if (!isFinite(n) || n < 1000) return 1000;
    return Math.min(n, 1e9);
  }

  function render() {
    var start = readAmount();
    var years = parseInt(yearsInput.value, 10);
    yearsOut.textContent = years;

    var W = 640, H = 340;
    var m = { l: 62, r: 34, t: 16, b: 34 };
    var finalInvested = value(start, RATE_INVESTED, years);
    var finalCash = value(start, RATE_CASH, years);
    var ymax = niceMax(finalInvested);

    function x(i) { return m.l + (W - m.l - m.r) * (i / years); }
    function y(v) { return m.t + (H - m.t - m.b) * (1 - v / ymax); }

    var html = '<g class="chart-grid">';
    var i, v;
    for (i = 0; i <= 4; i++) {
      v = (ymax / 4) * i;
      html += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/>';
    }
    html += "</g>";

    html += '<g class="chart-axis">';
    for (i = 0; i <= 4; i++) {
      v = (ymax / 4) * i;
      html += '<text x="' + (m.l - 10) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + compact.format(v) + "</text>";
    }
    var tickEvery = Math.max(1, Math.ceil(years / 6));
    for (i = 0; i <= years; i += tickEvery) {
      html += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + (i === 0 ? "Today" : "Year " + i) + "</text>";
    }
    html += "</g>";

    var dInvested = "", dCash = "";
    for (i = 0; i <= years; i++) {
      dInvested += (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(value(start, RATE_INVESTED, i)).toFixed(1) + " ";
      dCash += (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(value(start, RATE_CASH, i)).toFixed(1) + " ";
    }

    var drawClass = firstDraw && !reduceMotion ? " draw" : "";
    html += '<path class="line line-cash" d="' + dCash + '"/>';
    html += '<path class="line line-invested' + drawClass + '" pathLength="1" d="' + dInvested + '"/>';
    html += '<circle class="end-dot-cash" cx="' + x(years).toFixed(1) + '" cy="' + y(finalCash).toFixed(1) + '" r="5"/>';
    html += '<circle class="end-dot-invested" cx="' + x(years).toFixed(1) + '" cy="' + y(finalInvested).toFixed(1) + '" r="6"/>';

    chart.innerHTML = html;
    firstDraw = false;

    outInvested.textContent = money.format(finalInvested);
    outCash.textContent = money.format(finalCash);
    chart.setAttribute(
      "aria-label",
      "Line chart. " + money.format(start) + " grows to " + money.format(finalInvested) +
        " at 7% a year, or " + money.format(finalCash) + " at 2% a year, over " + years + " years."
    );
  }

  amountInput.addEventListener("input", render);
  yearsInput.addEventListener("input", render);
  render();

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var submitButton = form.querySelector('button[type="submit"]');
  form.noValidate = true;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (submitButton.disabled) return;
    var fields = form.querySelectorAll("input[required], select[required], textarea[required]");
    var firstBad = null;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    Array.prototype.forEach.call(fields, function (field) {
      var bad = !field.value.trim() || (field.type === "email" && !emailPattern.test(field.value.trim()));
      field.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && !firstBad) firstBad = field;
    });

    status.classList.toggle("is-error", !!firstBad);

    if (firstBad) {
      status.textContent = "Complete the highlighted fields, then send your message again.";
      firstBad.focus();
      return;
    }

    var name = form.elements.name.value.trim().split(" ")[0];
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending your message…";

    try {
      var response = await fetch(form.getAttribute("action"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      });

      if (!response.ok) throw new Error("Message submission failed");

      status.textContent = "Thank you, " + name + ". Your message has been sent. We will reply within one business day.";
      form.reset();
      Array.prototype.forEach.call(fields, function (field) { field.removeAttribute("aria-invalid"); });
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = "Your message could not be sent. Please try again or use the email link to contact us directly.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send message";
      form.removeAttribute("aria-busy");
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
