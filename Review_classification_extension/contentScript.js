
(() => {
    // let comments = document.getElementsByClassName("text")[0]
    // // console.log(comments.textContent);
    // let commentsArray
    let results

    // Default value
    let extensionEnabled = true; 

    chrome.storage.sync.get('extensionEnabled', (data) => {
        // Default to true if not set
        extensionEnabled = data.extensionEnabled !== false

        if (extensionEnabled) {
            console.log("Extension is enabled");
        }
    })

    console.log("contentScript");

    chrome.runtime.onMessage.addListener(async (message, sender) => {
        
        const { type, imdbId } = message;
        console.log(imdbId);

        if (type === "NEW" && extensionEnabled) {
            const comments = document.querySelectorAll(".text");
            const commentsArray = Array.from(comments).map(comment => comment.textContent);
            results = await getClassificationResult(commentsArray)
            createNewLabelElement(results)        
        }

    });

    const getClassificationResult = async (commentsArray) => {
        
        const apiUrl = "http://127.0.0.1:8000/predict";
        const data = { "text_list": commentsArray };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            
            const results = await response.json();
            console.log(results);
            return results;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const createNewLabelElement = (results) => {
        const list_review = document.querySelectorAll(".lister-item-content:not(.assigned)")
        // console.log(results);
        if (results) {
            list_review.forEach((review, index) => {
                const newElement = document.createElement("h3")
                newElement.textContent = results[index] 
                newElement.style.textTransform = "uppercase"
                switch (newElement.textContent) {
                    case "positive":
                        newElement.style.color = "#16a34a"
                        break;
                    case "negative" :
                        newElement.style.color = "#b71c1c"
                        break;
                    case "neutral" :
                        newElement.style.color = "#f59e0b"
                        break;
                    default:
                        break;
                }
                review.classList.add("assigned")
                review.insertBefore(newElement, review.firstChild)
            })
        }
    }

    const load_moreBtn = document.querySelector(".ipl-load-more__button")
    // load_moreBtn.addEventListener("click", async () => {
    //     console.log("load more clicked");
    //     let newCommentsArray = []
    //     const newReviewsList = document.querySelectorAll(".lister-item-content:not(.assigned)")
    //     console.log(newReviewsList);
    //     newReviewsList.forEach((newReview, index) => {
    //         const comment = newReview.querySelector("text") 
    //         newCommentsArray.push(comment.textContent)
    //     })
        
    //     if (newCommentsArray.length > 0) {
    //         results = await getClassificationResult(newCommentsArray)
    //         createNewLabelElement(results)
    //     }

    // })

    const observeNewReviews = () => {
        const reviewsContainer = document.querySelector(".lister-list") 

        const observer = new MutationObserver(async () => {
            const newReviewsList = document.querySelectorAll(".lister-item-content:not(.assigned)")

            if (newReviewsList.length > 0) {
                const newCommentsArray = Array.from(newReviewsList, (newReview) => {
                    const newComment = newReview.querySelector(".text") 
                    return newComment.textContent
                })

                if (newCommentsArray.length > 0) {
                    results = await getClassificationResult(newCommentsArray) 
                    createNewLabelElement(results)
                }
            }
        })

        const observerConfig = {
            childList: true,
            subtree: true,
        }

        observer.observe(reviewsContainer, observerConfig)
    }

    load_moreBtn.addEventListener("click", () => {
        console.log("Load more clicked");
        if (extensionEnabled) {
            observeNewReviews()
        }
    })

})();

