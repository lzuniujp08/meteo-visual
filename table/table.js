var fixedCol = document.getElementById("fixedCol");
var fixedRow = document.getElementById("fixedRow");
var tBody = document.getElementById("tBody");

function scrollV(evt) {
  var scrollTop = tBody.scrollTop;
  fixedCol.scrollTop = scrollTop;

  var scrollLeft = tBody.scrollLeft;
  fixedRow.scrollLeft = scrollLeft;
}
