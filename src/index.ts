function calculateMyGrade(grades: number[]): number {
  let total = grades.reduce((acc, n) => acc + n, 0);
  let average = total / grades.length;
  return average;
}

let grades: number[] = [90, 92, 94, 98];
let res = calculateMyGrade(grades);
console.log(res);
      