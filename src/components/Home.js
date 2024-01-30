import React, { useState, useEffect } from "react";
import QuizCreate from "./QuizCreate";
import style from "../styles/Home.module.css";
import axios from "axios";
import QuizAnalytics from "./QuizAnalytics";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [total, setTotal] = useState(0);

  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quiz/quizcount")
      .then((response) => setQuizCount(response.data.quizCount))
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:5000/api/quiz/questioncount")
      .then((response) => setQuestionCount(response.data.questionCount))
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:5000/api/quiz/totalviews")
      .then((response) => setTotal(response.data.total))

      .catch((error) => console.error(error));
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
    }

    const timeoutId = setTimeout(() => {
      localStorage.removeItem("authToken");
      navigate("/");
    }, 3600 * 1000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/quiz/getquiz"
      );
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleShowCreateQuiz = () => {
    setShowCreateQuiz(true);
    setActivePage("Create Quiz");
  };
  const handleCloseCreateQuiz = () => {
    setShowCreateQuiz(false);
    setActivePage("Dashboard");
    fetchQuizzes();
  };
  const handleshowAnalytics = () => {
    setActivePage("Analytics");
  };

  const handleDashboard = () => {
    setActivePage("Dashboard");
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
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
    <div className={style.HomeContainer}>
      <div className={style.sidebar}>
        <h1>QUIZZIE</h1>
        <div className={style.sidebarBtns}>
          <li onClick={handleDashboard}>Dashboard</li>
          <li onClick={handleshowAnalytics}> Analytics</li>
          <li onClick={handleShowCreateQuiz}>Create Quiz</li>
        </div>

        <button className={style.logUser} onClick={handleLogout}>
          <hr></hr>LOGOUT
        </button>
      </div>
      <div className={style.sidebarContainer}>
        {activePage === "Dashboard" && (
          <>
            <div className={style.divContainer}>
              <div className={style.div_1}>
                <h2>
                  <span>{quizCount}</span> Quiz
                </h2>
                <h2>Created</h2>
              </div>
              <div className={style.div_2}>
                <h2>
                  <span>{questionCount}</span>Questions
                </h2>
                <h2> Created</h2>
              </div>
              <div className={style.div_3}>
                <h2>
                  <span>{total}</span>Total
                </h2>
                <h2>Impressions</h2>
              </div>
            </div>
            <div className={style.listQuiz}>
              <h2>Trending Quizs</h2>
              <div className={style.trendQuiz}>
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className={style.oneQuiz}>
                    <div className={style.quizDetails}>
                      <h2>{quiz.quizName}</h2>
                      <span>
                        {quiz.impressions}
                        <IoEyeOutline />
                      </span>
                    </div>
                    <h3>
                      Created on:<span>{formatDate(quiz.createdDate)}</span>
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {activePage === "Create Quiz" && (
          <QuizCreate
            isOpen={showCreateQuiz}
            onRequestClose={handleCloseCreateQuiz}
          />
        )}
        {activePage === "Analytics" && <QuizAnalytics />}
      </div>
    </div>
  );
};

export default Home;
