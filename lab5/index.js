document.addEventListener("DOMContentLoaded", function () {
    let questions = [
      {
        type: "radio",
        question: "Який елемент HTML використовується для створення заголовку?",
        answers: ["h1", "h2", "h3", "h4"],
        correctAnswer: "h1",
      },
      {
        type: "radio",
        question: "Який елемент HTML використовується для створення заголовку?",
        answers: ["h1", "h2", "h3", "h4"],
        correctAnswer: "h1",
      },
      {
        type: "radio",
        question: "Який елемент HTML використовується для створення заголовку?",
        answers: ["h1", "h2", "h3", "h4"],
        correctAnswer: "h1",
      },
      {
        type: "checkbox",
        question: "Які елементи HTML використовуються для створення списку?",
        answers: ["ul", "ol", "li", "dl"],
        correctAnswers: ["ul", "ol"],
      },
      {
        type: "dropdown",
        question: "Який атрибут HTML використовується для вказівки кольору тексту?",
        answers: ["color", "text-color", "font-color", "style"],
        correctAnswer: "color",
      },
      {
        type: "dragdrop",
        question: "Поставте відповідність між HTML та CSS:",
        pairs: [
          { html: "div", css: "block" },
          { html: "span", css: "inline" },
          { html: "h1", css: "header" },
        ],
      },
    ];
  
    let currentQuestion = 0;
    let score = 0;
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }
  
    function displayQuestion() {
      let question = questions[currentQuestion];
  
      // Display question
      let questionItem = document.createElement("li");
  
      switch (question.type) {
        case "radio":
          questionItem.innerHTML = `
            <div class="question">
              <p>${currentQuestion + 1}. ${question.question}</p>
            </div>
            <div class="answers">
              ${question.answers
                .map(
                  (answer, answerIndex) =>
                    `<label>
                      <input type="radio" name="q${currentQuestion}" value="${answer}">
                      ${answer}
                    </label>`
                )
                .join("")}
            </div>
          `;
          break;
  
        case "checkbox":
          questionItem.innerHTML = `
            <div class="question">
              <p>${currentQuestion + 1}. ${question.question}</p>
            </div>
            <div class="answers">
              ${question.answers
                .map(
                  (answer, answerIndex) =>
                    `<label>
                      <input type="checkbox" name="q${currentQuestion}" value="${answer}">
                      ${answer}
                    </label>`
                )
                .join("")}
            </div>
          `;
          break;
  
        case "dropdown":
          questionItem.innerHTML = `
            <div class="question">
              <p>${currentQuestion + 1}. ${question.question}</p>
            </div>
            <div class="answers">
              <select name="q${currentQuestion}">
                <option value="" disabled selected>Оберіть відповідь</option>
                ${question.answers
                  .map(
                    (answer) =>
                      `<option value="${answer}">${answer}</option>`
                  )
                  .join("")}
              </select>
            </div>
          `;
          break;
  
        case "dragdrop":
          questionItem.innerHTML = `
            <div class="question">
              <p>${currentQuestion + 1}. ${question.question}</p>
            </div>
            <div class="pairs" id="pairs">
              ${question.pairs
                .map(
                  (pair, pairIndex) =>
                    `<div class="pair" id="pair${pairIndex}" draggable="true" ondragstart="dragStart(event)">
                      <span class="html">${pair.html}</span>
                      <span class="css">${pair.css}</span>
                    </div>`
                )
                .join("")}
            </div>
            <div class="answers" id="drop-area" ondrop="drop(event)" ondragover="allowDrop(event)">
              <p>Відповідність:</p>
              ${question.pairs
                .map(
                  (pair, pairIndex) =>
                    `<div class="drop-target" id="target${pairIndex}" data-correct="${pair.css}"></div>`
                )
                .join("")}
            </div>
          `;
          break;
      }
  
      // Display Next button for all questions except the last one
      if (currentQuestion < questions.length - 1) {
        let nextButton = document.createElement("button");
        nextButton.textContent = "Далі";
        nextButton.addEventListener("click", function () {
          saveAnswer();
          currentQuestion++;
          displayQuestion();
        });
        questionItem.appendChild(nextButton);
      } else {
        // Display Submit button for the last question
        let submitButton = document.createElement("button");
        submitButton.textContent = "Завершити тест";
        submitButton.addEventListener("click", function () {
          saveAnswer();
          showResults();
        });
        questionItem.appendChild(submitButton);
      }
  
      document.querySelector(".questions").innerHTML = "";
      document.querySelector(".questions").appendChild(questionItem);
    }
  
    function saveAnswer() {
      let selectedAnswer;
  
      switch (questions[currentQuestion].type) {
        case "radio":
          selectedAnswer = document.querySelector(
            `input[name="q${currentQuestion}"]:checked`
          );
          break;
  
        case "checkbox":
          selectedAnswer = document.querySelectorAll(
            `input[name="q${currentQuestion}"]:checked`
          );
          break;
  
        case "dropdown":
          selectedAnswer = document.querySelector(
            `select[name="q${currentQuestion}"]`
          );
          break;
  
        case "dragdrop":
          break; // No need to save answers for drag and drop
      }
  
      checkAnswer(selectedAnswer);
    }
  
    function checkAnswer(selectedAnswer) {
      let question = questions[currentQuestion];
  
      switch (question.type) {
        case "radio":
          if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
            score++;
          }
          break;
  
        case "checkbox":
          let correctAnswers = question.correctAnswers || [];
          let selectedAnswers = Array.from(selectedAnswer || []).map(
            (input) => input.value
          );
  
          if (
            correctAnswers.length === selectedAnswers.length &&
            correctAnswers.every((answer) => selectedAnswers.includes(answer))
          ) {
            score++;
          }
          break;
  
        case "dropdown":
          if (
            selectedAnswer &&
            selectedAnswer.value === question.correctAnswer
          ) {
            score++;
          }
          break;
  
        case "dragdrop":
          let pairs = question.pairs || [];
  
          pairs.forEach((pair, pairIndex) => {
            let target = document.getElementById(`target${pairIndex}`);
            let dragged = document.getElementById(`pair${pairIndex}`);
            let correctAnswer = target.getAttribute("data-correct");
  
            if (dragged && target && correctAnswer === dragged.querySelector(".css").textContent) {
              score++;
            }
          });
          break;
      }
    }
  
    function showResults() {
      let userName = document.querySelector('input[name="name"]').value;
      let userGroup = document.querySelector('input[name="group"]').value;
  
      document.querySelector(".score").textContent = `${userName} з групи ${userGroup}, ваш результат: ${score} балів`;
      document.getElementById("questions").style.display = "none";
      document.getElementById("results").style.display = "block";
    }
  
    // Initial display of the first question
    displayQuestion();
  });
  
  function allowDrop(event) {
    event.preventDefault();
  }
  
  function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
  }
  
  function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var dropTarget = getDropTarget(event.target);
  
    if (draggedElement && dropTarget) {
      dropTarget.appendChild(draggedElement);
    }
  }
  
  function getDropTarget(element) {
    while (element) {
      if (element.classList.contains("drop-target")) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }
  