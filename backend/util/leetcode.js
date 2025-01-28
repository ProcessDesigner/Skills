import fetch from "node-fetch";

const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
    matchedUserStats: matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        __typename
      }
    }
  }
`;

const formatData = (data) => ({
  totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
  totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum,
  totalQuestions: data.allQuestionsCount[0].count,
  easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
  totalEasy: data.allQuestionsCount[1].count,
  mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
  totalMedium: data.allQuestionsCount[2].count,
  hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
  totalHard: data.allQuestionsCount[3].count,
  ranking: data.matchedUser.profile.ranking,
  contributionPoint: data.matchedUser.contributions.points,
  reputation: data.matchedUser.profile.reputation,
  submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
  recentSubmissions: data.recentSubmissionList,
  matchedUserStats: data.matchedUser.submitStats,
});

export const leetcode = async (req, res) => {
  console.log(req.params.id);
  const username = req.params.id; 
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const result = await response.json();

    if (response.ok) {
      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        return res.status(400).send(result.errors);
      }

      const formattedData = formatData(result.data);
      return res.status(200).send(formattedData);
    } else {
      console.error("HTTP Error:", response.status, response.statusText);
      return res.status(response.status).send({ error: "Failed to fetch data from LeetCode." });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({ error: "Internal Server Error", details: error.message });
  }
};