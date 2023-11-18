import express from "express";
import arr from "./question.js"

const host = "127.0.0.1";
const PORT = 3000;

const app = express();
app.use(express.json())

const findQuestions = (marks, easy, medium, hard) => {

    if (marks < 0) return "Marks cannot be negative";
    if (parseInt(easy) + parseInt(medium) + parseInt(hard) !== 100) return "Sum of percentages not equal to 100";


    let easyMarks = ((easy*1.0) / 100) * marks
    let mediumMarks = ((medium*1.0) / 100) * marks
    let hardMarks = ((hard*1.0) / 100) * marks

    let result = []

    for (let i = 0; i < arr.length && (easyMarks > 0 || mediumMarks > 0 || hardMarks > 0); i++) {
        if (arr[i].difficulty === "Easy" && easyMarks > 0) {
            easyMarks -= 5;
            result.push(arr[i])
        }
        else if (arr[i].difficulty === "Medium" && mediumMarks > 0) {
            mediumMarks -= 10;
            result.push(arr[i])
        }
        else if (arr[i].difficulty === "Hard" && hardMarks > 0) {
            hardMarks -= 20;
            result.push(arr[i])
        }
    }

    if (easyMarks || mediumMarks || hardMarks) {
        return "Cannot create questions for the given constraints";
    }

    return result;
}

app.get("/generate",  (req, res) => {
    try {
        const { marks, difficulty } = req.body;
        const result = findQuestions(marks, difficulty.easy, difficulty.medium, difficulty.hard);
        res.status(200).send({ result });
    } catch (err) {
        res.status(404).send("Code failiure in /get api")
    }
})
app.listen(PORT, host, () => {
    console.log(`The backend is running on port ${PORT}`);
})

