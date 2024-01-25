import React, { useState,useEffect } from "react";
import Modal from "react-modal";
import style from "../styles/QuizCreate.module.css";

import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from "axios";
import  {ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'




const QuizCreate = ({isOpen,onRequestClose}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      optionType: "Text",
      options: [{ optionText: "", isCorrect: false ,optionType:"Text"}],
      timerType: "5s", 
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

 useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);
  
  const closeModal = () => {
    setIsModalOpen(false);
    onRequestClose();
    setCurrentStep(1);
    setQuestions([
      {
        questionText: "",
        optionType: "Text",
        options: [{ optionText: "", isCorrect: false,optionType:"Text" }],
        timerType: "5s",
      },
    ]);
  };

  const createQuiz = async (quizData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/quiz/create",
        quizData
      );
      console.log(response.data); 
    } catch (error) {
      console.error(error); 
    }
  };

  const handleQuizType = (type) => {
    setQuizType(type);
  };
  const handleContinue = () => {
    if (currentStep === 1) {
      if (quizName && quizType) {
        setCurrentStep(2);
      } else {
        toast.error("Please provide Quiz Name and Type.",{position: 'top-right',
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      }
    } else {
      
      const quizData = {
        quizName,
        quizType,
        questions,
      };
      createQuiz(quizData);
      console.log("Submit Quiz:", { quizName, quizType });
      console.log("quiz questions", { questions });
      closeModal();
    }
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          questionText: "",
          optionType: "Text",
          options: [{ optionText: "", isCorrect: false,optionType:"Text"}],
          timerType: "5s",
        },
      ]);
      setCurrentQuestion(questions.length);
    } else {
      toast("Maximum 5 questions are allowed.",{position: 'top-right',
      autoClose: 3000, // Adjust as needed
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    }
  };

  const handleQuestionChange = (text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].questionText = text||"";
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (text, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options[optionIndex].optionText = text;
    setQuestions(updatedQuestions);
  };

  const handleOptionTypeChange = (type, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options[optionIndex].optionType = type;
    setQuestions(updatedQuestions);
  };
  const handleSelectQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleTimerTypeChange = (type) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].timerType = type;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = () => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[currentQuestion].options.length < 4) {
      updatedQuestions[currentQuestion].options.push({
        optionText: "",
        isCorrect:false,
        optionType:"Text",
      });
      setQuestions(updatedQuestions);
    } else {
      toast("Maximum 4 options are allowed for each question.",{position: 'top-right',
      autoClose: 3000, // Adjust as needed
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    }
  };

  const handleOptionImageChange = (value, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options[optionIndex].imageURL = value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options.forEach((option, i) => {
      option.isCorrect = i === optionIndex;
    });
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const renderOptions = () => {
    const { options} = questions[currentQuestion];

    return options.map((option, optionIndex) => (
      <div key={optionIndex} className={style.optionContainer}>
        {quizType === "QnA" && (
          <div>
            <input
              type="radio"
              id={`correctOption${optionIndex}`}
              name={`correctOption${currentQuestion}`}
              checked={option.isCorrect}
              onChange={() => handleCorrectOptionChange(optionIndex)}
            />
          </div>
        )}

        {option.optionType === "Text" && (
          <input
            type="text"
            value={option.optionText}
            placeholder="Text"
            onChange={(e) => handleOptionChange(e.target.value, optionIndex)}
          />
        )}

        {option.optionType === "ImageURL" && (
          <input
            type="text"
            value={option.imageURL}
            onChange={(e) => handleOptionChange(e.target.value, optionIndex)}
            placeholder="Image URL"
          />
        )}

        {option.optionType === "TextAndImageURL" && (
          <div>
            <input
              type="text"
              value={option.optionText}
              onChange={(e) => handleOptionChange(e.target.value, optionIndex)}
              placeholder="Text"
            />
            <input
              type="text"
              value={option.imageURL}
              onChange={(e) =>
                handleOptionImageChange(e.target.value, optionIndex)
              }
              placeholder="Image URL"
            />
          </div>
        )}

        {(optionIndex === 2 || optionIndex === 3) && (
          <RiDeleteBin5Fill
            className={style.deleteIcon}
            onClick={() => handleDeleteOption(optionIndex)}
          />
        )}
      </div>
    ));
  };

  const renderTimer = () =>
    quizType === "QnA" && (
      <div className={style.optionContainer}>
        <label>Timer</label>
        <input
          type="radio"
          id="timerType5s"
          name="timerType"
          value="5s"
          checked={questions[currentQuestion].timerType === "5s"}
          onChange={() => handleTimerTypeChange("5s")}
        />
        <label htmlFor="timerType5s">5 seconds</label>

        <input
          type="radio"
          id="timerType10s"
          name="timerType"
          value="10s"
          checked={questions[currentQuestion].timerType === "10s"}
          onChange={() => handleTimerTypeChange("10s")}
        />
        <label htmlFor="timerType10s">10 seconds</label>

        <input
          type="radio"
          id="timerTypeOff"
          name="timerType"
          value="Off"
          checked={questions[currentQuestion].timerType === "Off"}
          onChange={() => handleTimerTypeChange("Off")}
        />
        <label htmlFor="timerTypeOff">Off</label>
      </div>
    );

  const renderAddOptionButton = () => {
    const options = questions[currentQuestion].options;

    // Only render the '+ Add Option' button if there are less than 4 options
    if (options.length < 4) {
      return (
        <div className={style.optionContainer}>
          <button onClick={handleAddOption}>+ Add Option</button>
        </div>
      );
    }

    return null;
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);

    // If the deleted question was the last one, select the previous question
    if (index === currentQuestion && index > 0) {
      handleSelectQuestion(index - 1);
    }
  };

  return (
    <div>
      <div className={style.createQuiz}>
        <ToastContainer/>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className={style.modal}
          overlayClassName={style.overlay}
        >
          {currentStep === 1 && (
            <>
              <input
                type="text"
                placeholder="Quiz name"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              ></input>

              <div className={style.typequiz}>
                <label>Quiz Type</label>
                <button
                  onClick={() => handleQuizType("QnA")}
                  className={quizType === "QnA" ? style.active : ""}
                >
                  QnA
                </button>
                <button
                  onClick={() => handleQuizType("Poll")}
                  className={quizType === "Poll" ? style.active : ""}
                >
                  Poll
                </button>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className={style.questionNavigation}>
                {questions.map((_, index) => (
                  <div key={index} className={style.questionNavItem}>
                    <button
                      onClick={() => handleSelectQuestion(index)}
                      className={index === currentQuestion ? style.active : ""}
                    >
                      {`${index + 1}`}
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className={style.deleteQuestionBtn}
                    >
                      X
                    </button>
                  </div>
                ))}
                {questions.length < 5 && (
                  <button
                    onClick={handleAddQuestion}
                    className={style.addQuestionBtn}
                  >
                    +
                  </button>
                )}
                <p>Max 5 questions</p>
              </div>

              {/* Current Question Details */}
              {currentQuestion >= 0 && (
                <div className={style.questionContainer}>
                  <input
                    type="text"
                    value={questions[currentQuestion].questionText}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                  ></input>

                  <div className={style.optionTypeContainer}>
                    <label>Option Type</label>
                    <input
                      type="radio"
                      id={`optionTypeText${currentQuestion}`}
                      name={`optionType${currentQuestion}`}
                      value="Text"
                      checked={
                        questions[currentQuestion].options[0].optionType === "Text"
                      }
                      onChange={() => handleOptionTypeChange("Text", 0)}
                    />
                    <label htmlFor={`optionTypeText${currentQuestion}`}>
                      Text
                    </label>

                    <input
                      type="radio"
                      id={`optionTypeImage${currentQuestion}`}
                      name={`optionType${currentQuestion}`}
                      value="ImageURL"
                      checked={
                        questions[currentQuestion].options[0].optionType ===
                        "ImageURL"
                      }
                      onChange={() => handleOptionTypeChange("ImageURL", 0)}
                    />
                    <label htmlFor={`optionTypeImage${currentQuestion}`}>
                      Image URL
                    </label>

                    <input
                      type="radio"
                      id={`optionTypeTextImage${currentQuestion}`}
                      name={`optionType${currentQuestion}`}
                      value="TextAndImageURL"
                      checked={
                        questions[currentQuestion].options[0].optionType ===
                        "TextAndImageURL"
                      }
                      onChange={() =>
                        handleOptionTypeChange("TextAndImageURL", 0)
                      }
                    />
                    <label htmlFor={`optionTypeTextImage${currentQuestion}`}>
                      Text & Image URL
                    </label>
                  </div>

                  
                  {renderOptions()}

                  {renderAddOptionButton()}


                  {renderTimer()}
                </div>
              )}
            </>
          )}
          <div className={style.buttonContainer}>
            <button onClick={closeModal} className={style.cancelBtn}>
              Cancel
            </button>
            <button onClick={handleContinue} className={style.cntdBtn}>
              {currentStep === 1 ? "Continue" : "Create Quiz"}
            </button>
            
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default QuizCreate;
