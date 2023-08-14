var scoreText = document.getElementById("usahScore");
scoreValue = scoreText.innerText;
console.log("Your current total score is: " + scoreValue);

const getYourRank = (score) => {
  switch (true) {
    case score >= 1200:
      console.log("Master Rank!");
      document.getElementById("rank_image").src = "/css/Radiant.png";
      break;

    case score >= 900:
      console.log("Platinum Rank!");
      document.getElementById("rank_image").src = "/css/Platinum.png";
      break;

    case score >= 600:
      console.log("Gold Rank!");
      document.getElementById("rank_image").src = "/css/Gold.png";
      break;

    case score >= 300:
      console.log("Silver Rank!");
      document.getElementById("rank_image").src = "/css/Silver.png";
      break;

    case score >= 0:
      console.log("Bronze Rank!");
      document.getElementById("rank_image").src = "/css/Bronze.png";
      break;

    default:
      console.log("Unranked! This is an error");
  }
};

getYourRank(scoreValue);
