const shift1 = document.getElementById("shift1");
const shift2 = document.getElementById("shift2");
const shift3 = document.getElementById("shift3");
const checkBtn = document.getElementById("checkBtn");
const solveBtn = document.getElementById("solveBtn");
const resetBtn = document.getElementById("resetBtn");
const resultText = document.getElementById("resultText");

const employees = ["Ana", "Luis", "Mia"];
const shifts = ["Morning", "Afternoon", "Night"];

function getAssignments() {
  return {
    Morning: shift1.value,
    Afternoon: shift2.value,
    Night: shift3.value
  };
}

function setAssignments(assignments) {
  shift1.value = assignments.Morning || "";
  shift2.value = assignments.Afternoon || "";
  shift3.value = assignments.Night || "";
}

function isValidAssignment(assignments, shift, employee) {
  // Constraint 1: no employee can work more than one shift
  for (const currentShift of shifts) {
    if (currentShift !== shift && assignments[currentShift] === employee) {
      return false;
    }
  }

  // Constraint 2: Ana cannot work the Night Shift
  if (shift === "Night" && employee === "Ana") {
    return false;
  }

  return true;
}

function checkConstraints() {
  const assignments = getAssignments();

  resultText.classList.remove("valid", "invalid");

  if (
    assignments.Morning === "" ||
    assignments.Afternoon === "" ||
    assignments.Night === ""
  ) {
    resultText.textContent = "Invalid: every shift must have an assigned employee.";
    resultText.classList.add("invalid");
    return;
  }

  for (const shift of shifts) {
    const employee = assignments[shift];

    const tempAssignments = { ...assignments };
    tempAssignments[shift] = "";

    if (!isValidAssignment(tempAssignments, shift, employee)) {
      if (shift === "Night" && employee === "Ana") {
        resultText.textContent = "Invalid: Ana cannot be assigned to the Night Shift.";
      } else {
        resultText.textContent = "Invalid: the same employee cannot be assigned to multiple shifts.";
      }

      resultText.classList.add("invalid");
      return;
    }
  }

  resultText.textContent = "Valid solution: all constraints are satisfied.";
  resultText.classList.add("valid");
}

function backtrackingSolve(assignments, shiftIndex = 0) {
  if (shiftIndex === shifts.length) {
    return true;
  }

  const currentShift = shifts[shiftIndex];

  if (assignments[currentShift] !== "") {
    if (isValidAssignment(assignments, currentShift, assignments[currentShift])) {
      return backtrackingSolve(assignments, shiftIndex + 1);
    }
    return false;
  }

  for (const employee of employees) {
    if (isValidAssignment(assignments, currentShift, employee)) {
      assignments[currentShift] = employee;

      if (backtrackingSolve(assignments, shiftIndex + 1)) {
        return true;
      }

      assignments[currentShift] = "";
    }
  }

  return false;
}

function autoSolve() {
  resultText.classList.remove("valid", "invalid");

  const assignments = getAssignments();
  const normalizedAssignments = {
    Morning: assignments.Morning,
    Afternoon: assignments.Afternoon,
    Night: assignments.Night
  };

  const solved = backtrackingSolve(normalizedAssignments);

  if (solved) {
    setAssignments(normalizedAssignments);
    resultText.textContent = "Solved automatically using backtracking.";
    resultText.classList.add("valid");
  } else {
    resultText.textContent = "No valid solution found.";
    resultText.classList.add("invalid");
  }
}

function resetForm() {
  shift1.value = "";
  shift2.value = "";
  shift3.value = "";
  resultText.textContent = "Choose employees and check the constraints.";
  resultText.classList.remove("valid", "invalid");
}

checkBtn.addEventListener("click", checkConstraints);
solveBtn.addEventListener("click", autoSolve);
resetBtn.addEventListener("click", resetForm);