import React, { useState, useEffect } from "react";
import QuizCreate from "./QuizCreate";
import style from "../styles/Home.module.css";
import axios from "axios";
import QuizAnalytics from "./QuizAnalytics";

const Home = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quiz/quizcount")
      .then((response) => setQuizCount(response.data.quizCount))
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:5000/api/quiz/questioncount")
      .then((response) => setQuestionCount(response.data.questionCount))
      .catch((error) => console.error(error));
  }, []);
  const handleShowCreateQuiz = () => {
    setShowCreateQuiz(true);
    setActivePage("Create Quiz")
  };
  const handleCloseCreateQuiz = () => {
    setShowCreateQuiz(false);
    setActivePage("Dashboard")
  };
  const handleshowAnalytics = () => {
    setActivePage("Analytics");
  };
  return (
    <div className={style.HomeContainer}>
      <div className={style.sidebar}>
        <h1>QUIZZIE</h1>
        <div className={style.sidebarBtns}>
          <li>Dashboard</li>
          <li onClick={handleshowAnalytics}> Analytics</li>
          <li onClick={handleShowCreateQuiz}>Create Quiz</li>
        </div>

        <button className={style.logUser}>
          <hr></hr>LOGOUT
        </button>
      </div>
      <div className={style.sidebarContainer}>
        {activePage==='Dashboard'&&(
          <>
          <div className={style.divContainer}>
          <div className={style.div_1}>
            <h1>
              <span>{quizCount}</span>Quiz <br></br>Created
            </h1>
          </div>
          <div className={style.div_2}>
            <h2>{questionCount}Questions Created</h2>
          </div>
          <div className={style.div_3}>Impressions</div>
        </div>
        <div>
          <h2>Trending Quizs</h2>
        </div>
        </>
        )}
        {activePage==='Create Quiz' && (
          <QuizCreate
            isOpen={showCreateQuiz}
            onRequestClose={handleCloseCreateQuiz}
          />
        )}
        {activePage==='Analytics'&& <QuizAnalytics/>}
      </div>
    </div>
  );
};

export default Home;
