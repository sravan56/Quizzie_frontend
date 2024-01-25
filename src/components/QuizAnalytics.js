import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../styles/QuizAnalytics.module.css";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const QuizAnalytics = () => {
  const [quizzes, setQuizzes] = useState([]);

  const navigate = useNavigate("");

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

    return date.toLocaleDateString("en-IN", options);
  };
  

  const handleEditQuiz = (quizId) => {
    navigate("/");
  };
  const handleDeleteQuiz = async (quizId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (confirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/api/quiz/deletequiz/${quizId}`
        );
        toast.success('Quiz deleted successfully!', {
            position: 'top-right',
            autoClose: 3000, // Adjust as needed
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        fetchQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };
  const handleShareQuiz = (quizId) => {};
  return (
    <div className={style.activeContainer}>
      <h1>Quiz Analysis</h1>
      <ToastContainer/>
      <div className={style.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th>Impression</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.quizName}</td>
                <td>{formatDate(quiz.createdDate)}</td>
                <td>Impression</td>
                <td onClick={() => handleEditQuiz(quiz._id)}>
                  <FaRegEdit />
                </td>
                <td onClick={() => handleDeleteQuiz(quiz._id)}>
                  <RiDeleteBinFill />
                </td>
                <td onClick={() => handleShareQuiz(quiz._id)}>
                  <IoMdShare />
                </td>
                <td>Question Wise Analysis</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizAnalytics;
