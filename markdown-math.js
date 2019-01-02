const math = require('mathjs');
let scope = {};

// { Equations
//   "10": "[=2+3]",
//   "25": "[=2+3]"
// }
function getEquations(text) {
  // [=...] where ... is any mathjs valid thing
  let regex = /\[=[^\r\n\t]+?\]/g;
  let equations = {};
  let match;
  while ((match = regex.exec(text)) != null) {
    equations[match.index] = match[0];
  }

  if (Object.keys(equations).length == 0) return;

  let REGEX_CODE_INLINE = /(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/gm;
  let protectedRanges = findProtectedRanges(REGEX_CODE_INLINE, text);

  for (i in equations) {
    let isProtected = protectedRanges.some((range) => {
      return i >= range[0] && i <= range[1];
    });
    if (isProtected) delete(equations[i]);
  }
  return equations;
}

// [ Protected Ranges
//   [9, 15],
//   [16, 24]
// ]
let findProtectedRanges = (regex, text) => {
  let ranges = [];
  let match;
  while ((match = regex.exec(text)) != null) {
    ranges.push([match.index, regex.lastIndex - 1]);
  }
  return ranges;
}

module.exports = (text) => {
  let equations = getEquations(text);
  if (equations) {
    let solutions = {};
    for (i in equations) {
      let eq = equations[i].replace('[=','').replace(']','');
      try {
        solutions[i] = math.eval(eq, scope);
      } catch (error) { console.log(error); }
    }

    // Replace each equation backwards to prevent shifting indices
    let solutionIndices = Object.keys(solutions)
      .map((i) => parseInt(i))
      .sort((a,b) => b-a);

    for (let j = 0; j < solutionIndices.length; j++) {
      let i = solutionIndices[j];
      let iEnd = parseInt(i) + equations[i].length;
      text = text.slice(0, i)
        + solutions[i]
        + text.slice(iEnd, text.length);
    }
  }

  return text;
}