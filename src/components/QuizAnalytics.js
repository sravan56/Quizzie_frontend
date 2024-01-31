import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../styles/QuizAnalytics.module.css";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import QuestionWiseAnalysis from "./QuestionWiseAnalysis";
import QuizCreate from "./QuizCreate";

const QuizAnalytics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState("Analytics");
  const [editQuizDetails, setEditQuizDetails] = useState(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const apiURL = "https://quizzie-5r0l.onrender.com/api";

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/quiz/getquiz`
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

    return date
      .toLocaleDateString("en-IN", options)
      .replace(/(\d+)-(\w+)-(\d+)/, "$1 $2, $3");
  };

  const handleEditQuiz = async (quizId) => {
    try {
      const response = await axios.get(
        `${apiURL}/quiz/getquiz/${quizId}`
      );
      setEditQuizDetails(response.data);
      setShowCreateQuiz(true);
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  const handleCloseCreateQuiz = () => {
    setShowCreateQuiz(false);
  };
  const handleOpenDeleteModal = (quizId) => {
    setQuizToDelete(quizId);
    setDeleteModalIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setQuizToDelete(null);
    setDeleteModalIsOpen(false);
  };
  const handleDeleteQuiz = async () => {
    try {
      await axios.delete(
        `${apiURL}/quiz/deletequiz/${quizToDelete}`
      );
      toast.success("Quiz deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setQuizToDelete(null);
      setDeleteModalIsOpen(false);
    }
  };
  const handleShareQuiz = (quizId) => {
    const quizLink = `https://quiz-app-form.vercel.app/quizform/${quizId}`;
    navigator.clipboard.writeText(quizLink);
    toast.success("Quiz link copied to clipboard!", {
      position: "top-right",
      autoClose: 3000, // Adjust as needed
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleShowQuestionAnalysis = (quizId) => {
    
    setShowAnalysis("Analysis");
    setSelectedQuizId(selectedQuizId === quizId ? null : quizId);
  };

  return (
    <div className={style.activeContainer}>
      {showAnalysis === "Analytics" && (
        <>
          <h1>Quiz Analysis</h1>
          <ToastContainer />
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
                    <td>{quiz.impressions}</td>
                    <td onClick={() => handleEditQuiz(quiz._id)}>
                      <FaRegEdit />
                    </td>
                    <td onClick={() => handleOpenDeleteModal(quiz._id)}>
                      <RiDeleteBinFill />
                    </td>
                    <td onClick={() => handleShareQuiz(quiz._id)}>
                      <IoMdShare />
                    </td>
                    <td>
                      <Link
                        className={style.analysisLink}
                        onClick={() => handleShowQuestionAnalysis(quiz._id)}
                      >
                        QuestionWiseAnalysis
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={deleteModalIsOpen}
            onRequestClose={handleCloseDeleteModal}
            contentLabel="Delete Confirmation"
            className={style.modal}
            overlayClassName={style.overlay}
          >
            <p>
              Are you Confirm you <br />
              Want to delete?
            </p>
            <button className={style.deleteBtn} onClick={handleDeleteQuiz}>
              Confirm Delete
            </button>
            <button
              className={style.cancelBtn}
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </button>
          </Modal>
        </>
      )}
      {showAnalysis === "Analysis" && selectedQuizId && (
        <QuestionWiseAnalysis quizId={selectedQuizId} />
      )}
      {showCreateQuiz && (
        <QuizCreate
          isOpen={showCreateQuiz}
          onRequestClose={handleCloseCreateQuiz}
          quizDetails={editQuizDetails}
        />
      )}
    </div>
  );
};

export default QuizAnalytics;
