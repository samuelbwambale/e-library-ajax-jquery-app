"use strict";
$(function () { // IIFE function - InstantlyInvocked 

    testAddItems();
    testFetchItems();

    displayClock();
    fetchAllBooks();
    addBook();
});

function testFetchItems() {

    fetch('http://localhost:8083/pick_n_go_app_war_exploded/items', { method: 'GET' })
        .then(response => {
            console.log("Fetch items response --> ", response)
            if (response.ok) { return response.json(); }
            else {
                return Promise.reject({ status: response.status, statusText: response.body });
            }
        })
        .then(items => {
            console.log("Items ---> ", items)
                
        })
        .catch(error => {
            console.log('Error on fetching items:', error)
        });

}

function testAddItems() {
    const newItem = {
        itemName: "Orange Juice",
        description: "This is nice juice",
        category: "lunch"
    }
    fetch('http://localhost:8083/pick_n_go_app_war_exploded/items', {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Post item response --> ', response);
                if (response.ok) { return response.json(); }

            })
            .then(addedItem => {
                console.log('addedItem --> ', addedItem);
            })
            .catch(error => {
                console.log('Error on posting item -->', error)

            });
};


function fetchAllBooks() {
    let counter = 0;
    let booksTable = $("#booksTable");
    let bookTableError = $('#booksTableError');

    fetch('https://elibraryrestapi.herokuapp.com/elibrary/api/book/list', { method: 'GET' })
        .then(response => {
            console.log(response)
            if (response.ok) { return response.json(); }
            else {
                return Promise.reject({ status: response.status, statusText: response.body });
            }
        })
        .then(books => {
            books.forEach(book => {
                counter++;
                $("#tbody").append(
                    "<tr><th scope='row'> " + counter + " </th><td>" +
                    book.bookId + "</td><td>" +
                    book.isbn + "</td><td>" +
                    book.title + "</td><td>" +
                    new Intl.NumberFormat("en-US", {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                    }).format(book.overdueFee) + "</td><td>" +
                    book.publisher + "</td><td>" +
                    book.datePublished + "</td></tr>"
                );
            });
            booksTable.css("display", "block");
        })
        .catch(error => {
            console.log('Error on fetching books:', error)
            bookTableError.text(error.message);
            bookTableError.css("display", "block");
        });
};

function addBook() {
    $("#addBookForm").submit(event => {
        event.preventDefault();
        let title = $("#title");
        let isbn = $("#isbn");
        let overdueFee = $("#overdueFee");
        let publisher = $("#publisher");
        let datePublished = $("#datePublished");

        let bookCreateError = $("#bookCreateError");

        const newBook = {
            "isbn": isbn.val(),
            "title": title.val(),
            "overdueFee": overdueFee.val(),
            "publisher": publisher.val(),
            "datePublished": datePublished.val()
        }

        fetch('https://elibraryrestapi.herokuapp.com/elibrary/api/book/add', {
            method: 'POST',
            body: JSON.stringify(newBook),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Post response', response);
                if (response.ok) { return response.json(); }

            })
            .then(jsonResponseData => {
                console.log('jsonResponseData ', jsonResponseData);
                title.val('');
                isbn.val('');
                overdueFee.val(0.00);
                publisher.val('');
                datePublished.val('');
                window.location.href = "./listOfBooks.html";
            })
            .catch(error => {
                console.log('Error on posting a book:', error)
                bookCreateError.text(error);
                bookCreateError.css("display", "block");

            });
    });
};


function displayClock() {
    let d = new Date();
    let year = d.getFullYear();
    let date = d.getDate();
    date = date < 10 ? "0" + date : date;
    let minutes = d.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let seconds = d.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let months = new Array();
    months[0] = "January";
    months[1] = "February";
    months[2] = "March";
    months[3] = "April";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "August";
    months[8] = "September";
    months[9] = "October";
    months[10] = "November";
    months[11] = "December";
    let month = months[d.getMonth()];

    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    let dayOfWeek = weekday[d.getDay()];

    let hours = d.getHours();
    let amOrPm = (hours < 12) ? "AM" : "PM";
    let hour = (hours < 12) ? hours : hours - 12;
    hour = hour < 10 ? "0" + hour : hour;

    // Monday, 6 April 2020 - 08:21:37 AM
    // let d2 = `${dayOfWeek},  ${date} ${month} ${year} - ${hour}:${minutes}:${seconds} ${amOrPm}`;
    let d2 = `${dayOfWeek},  ${date} ${month} ${year}`;
    console.log("date today ", d2)

    document.getElementById('clock').innerHTML = d2;
    setTimeout(displayClock, 1000);

}

