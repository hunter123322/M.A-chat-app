"use strict";
function calculateMyGrade(grades) {
    let total = grades.reduce((acc, n) => acc + n, 0);
    let average = total / grades.length;
    return average;
}
let grades = [90, 92, 94, 98];
let res = calculateMyGrade(grades);
console.log(res);
//# sourceMappingURL=index.js.map