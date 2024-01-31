import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../styles/QuestionWiseAnalysis.module.css";

const QuestionWiseAnalysis = ({ quizId }) => {
  const [questionAnalysis, setQuestionAnalysis] = useState([]);
  const apiURL = "https://quizzie-5r0l.onrender.com/api";

  useEffect(() => {
    const fetchQuestionAnalysis = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/quiz/questionwiseanalysis/${quizId}`
        );
        setQuestionAnalysis(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching question analysis:", error);
      }
    };

    fetchQuestionAnalysis();
  }, [quizId]);

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date
      .toLocaleDateString("en-IN", options)
      .replace(/(\d+)-(\w+)-(\d+)/, "$1 $2, $3");
  };

  return (
    <div>
      <div className={style.QnaContainer}>
        {questionAnalysis.length > 0 && (
          <div className={style.detailsSection}>
            <h1>{questionAnalysis[0].quizName} Question Analysis</h1>
            <div>
              <h3>Created on: {formatDate(questionAnalysis[0].createdDate)}</h3>
              <h3>Impressions:{questionAnalysis[0].impressions}</h3>
            </div>
          </div>
        )}
        {questionAnalysis.map((question, index) => (
          <div key={index}>
            {question.quizType === "QnA" && (
              <>
                <h2>
                  Q{index + 1}. {question.questionText}
                </h2>
                <div className={style.questionSection}>
                  <div className={style.responseSection}>
                    <span>{question.responseCount}</span>
                    <h3>people attempted the Question</h3>
                  </div>
                  <div className={style.responseSection}>
                    <span>{question.correctCount}</span>
                    <h3>people answered Correctly</h3>
                  </div>
                  <div className={style.responseSection}>
                    <span>{question.wrongCount}</span>
                    <h3>people Answered Incorrectly</h3>
                  </div>
                </div>
                <hr></hr>
              </>
            )}

            {question.quizType === "Poll" && (
              <>
                <h2>
                  Q{index + 1}. {question.questionText}
                </h2>
                <div className={style.questionSection}>
                  {question.optionsAnalysis &&
                    question.optionsAnalysis.map((option, optionIndex) => (
                      <div key={optionIndex} className={style.optionSection}>
                        {option.questionOptionsAnalysis.map(
                          (quesOption, quesIndex) => (
                            <div
                              key={quesIndex}
                              className={style.responsSection}
                            >
                              <span>{quesOption.optionCount}</span>
                              <h3> {quesOption.optionText}</h3>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                </div>
                <hr></hr>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionWiseAnalysis;
