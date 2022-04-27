module.exports = getDate;

function getDate(){
  let today = new Date();
  let options = {
    year : "numeric"
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}
