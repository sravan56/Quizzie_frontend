import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import style from "../styles/QuizForm.module.css";
import image2 from "../images/image 2.png";
const QuizForm = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(null);
  const apiURL = "https://quiz-backend-snowy.vercel.app/api";

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/quiz/getquiz/${quizId}`
        );
        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching quiz", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    const updateImpressions = async () => {
      try {
        await axios.post(
          `${apiURL}/quiz/impressions/${quizId}`
        );
      } catch (error) {
        console.error("Error updating impressions", error);
      }
    };

    if (quizData) {
      updateImpressions();
    }
  }, [quizId, quizData]);

  console.log("QuizId", quizId);
  
  const handleAnswer = async (isCorrect) => {
    const currentOption = quizData.questions[currentQuestion].options[0];

    const responseData = {
      quizId,
      questionId: quizData.questions[currentQuestion]._id,
      selectedOption: {
        optionType: currentOption.optionType,
        optionText: currentOption.optionText,
        imageUrl: currentOption.imageUrl || null,
        optionId: currentOption._id,
      },
    };
    try {
      await axios.post(
        `${apiURL}}/quiz/response/${quizId}`,
        responseData
      );
      if (isCorrect) {
        setScore(score + 1);
      }
    } catch (error) {
      console.error("Error Submitting Form", error);
    }
  };
  const handleNext = async () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);

      const currentOption = quizData.questions[currentQuestion].options[0];

      const responseData = {
        quizId,
        questionId: quizData.questions[currentQuestion]._id,
        selectedOption: {
          optionType: currentOption.optionType,
          optionText: currentOption.optionText,
          imageUrl: currentOption.imageUrl || null,
          optionId: currentOption._id,
        },
      };
      await axios.post(
        `${apiURL}/quiz/response/${quizId}`,
        responseData
      );
    }
  };
  

  if (!quizData) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {showScore ? (
        <div className={style.scoreSection}>
          {quizData.quizType === "QnA" ? (
            <>
              <h2>Congrats Quiz is completed</h2>
              <img src={image2} alt="cupImage" />
              <h2>
                Your Score is{" "}
                <span>
                  {score}/{quizData.questions.length}
                </span>
              </h2>
            </>
          ) : (
            <>
              <h2>Thank you for participating the poll</h2>
            </>
          )}
        </div>
      ) : (
        <>
          <div className={style.quizSection}>
            <div className={style.countSection}>
              <span>
                {currentQuestion + 1}/{quizData.questions.length}
              </span>
              {quizData.quizType === "QnA" ? (
                <span></span>
              ) : (
                ""
              )}
            </div>
            <div className={style.questionSection}>
              <h3>{quizData.questions[currentQuestion].questionText}</h3>
            </div>
            <div className={style.answerSection}>
              {quizData.questions[currentQuestion].options.map(
                (option, optionIndex) => (
                  <div key={optionIndex}>
                    {option.optionType === "Text" && (
                      <button onClick={() => handleAnswer(option.isCorrect)}>
                        {option.optionText}
                      </button>
                    )}

                    {option.optionType === "ImageURL" && (
                      <div>
                        <button
                          className={style.imageurlOption}
                          onClick={() => handleAnswer(option.isCorrect)}
                        >
                          {option.imageUrl && (
                            <img
                              src={option.imageUrl}
                              alt={`Option ${optionIndex + 1}`}
                              className={style.imageOption}
                            />
                          )}
                        </button>
                      </div>
                    )}

                    {option.optionType === "TextAndImageURL" && (
                      <div>
                        <button
                          className={style.TextandImageOption}
                          onClick={() => handleAnswer(option.isCorrect)}
                        >
                          {option.optionText}
                          {option.imageUrl && (
                            <img
                              src={option.imageUrl}
                              alt={`Option ${optionIndex + 1}`}
                              className={style.imageOption}
                            />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
            <button onClick={handleNext} className={style.nxtBtn}>
              {currentQuestion + 1 !== quizData.questions.length
                ? "Next"
                : "Submit"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizForm;
