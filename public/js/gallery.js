let galleryImage = document.querySelectorAll('.gallery .box-container .right .box')

galleryImage.forEach(box => {
    box.addEventListener("mouseenter", () => {
        box.classList.add('active')
        const dynamicGallery = lightGallery(box, {
            dynamic: true,
            dynamicEl: [
                {src: 'images/insta pic/SGT-06.jpg'},
                {src: 'images/insta pic/SGT-07.jpg'},
                {src: 'images/insta pic/SGT-08.jpg'},
                {src: 'images/insta pic/SGT-09.jpg'},        
                {src: 'images/insta pic/SGT-10.jpg'},
                {src: 'images/insta pic/SGT-11.jpg'},
                {src: 'images/insta pic/SGT-13.jpg'},
                {src: 'images/insta pic/SGT-15.jpg'},
                {src: 'images/insta pic/SGT-18.jpg'},
                {src: 'images/insta pic/SGT-24.jpg'},
                {src: 'images/insta pic/SGT-25.jpg'},
                {src: 'images/insta pic/SGT-26.jpg'},
                {src: 'images/insta pic/SGT-33.jpg'},
                {src: 'images/insta pic/SGT-34.jpg'},
                {src: 'images/insta pic/SGT-35.jpg'},
                {src: 'images/insta pic/SGT-36.jpg'},
                {src: 'images/insta pic/SGT-37.jpg'},
                {src: 'images/insta pic/SGT-38.jpg'},
                {src: 'images/insta pic/SGT-39.jpg'},
                {src: 'images/insta pic/SGT-40.jpg'},
                {src: 'images/insta pic/SGT-41.jpg'},
                {src: 'images/insta pic/SGT-42.jpg'},
                {src: 'images/insta pic/SGT-43.jpg'},
                {src: 'images/insta pic/SGT-44.jpg'},
                {src: 'images/insta pic/SGT-45.jpg'},
                {src: 'images/insta pic/SGT-46.jpg'},
                {src: 'images/insta pic/SGT-47.jpg'},
                {src: 'images/insta pic/SGT-48.jpg'},
                {src: 'images/insta pic/SGT-49.jpg'},
                {src: 'images/insta pic/SGT-50.jpg'},
                {src: 'images/insta pic/SGT-51.jpg'},
                {src: 'images/insta pic/SGT-52.jpg'},
                {src: 'images/insta pic/SGT-53.jpg'},
                {src: 'images/insta pic/SGT-54.jpg'},
                {src: 'images/insta pic/SGT-55.jpg'},
                {src: 'images/insta pic/SGT-56.jpg'},
                {src: 'images/insta pic/SGT-57.jpg'},
                {src: 'images/insta pic/SGT-58.jpg'},
                {src: 'images/insta pic/SGT-59.jpg'},
                {src: 'images/insta pic/SGT-60.jpg'},
                {src: 'images/insta pic/SGT-61.jpg'},
                {src: 'images/insta pic/SGT-62.jpg'},
                {src: 'images/insta pic/SGT-63.jpg'},
                {src: 'images/insta pic/SGT-64.jpg'},
                {src: 'images/insta pic/SGT-65.jpg'},
                {src: 'images/insta pic/SGT-66.jpg'},
                {src: 'images/insta pic/SGT-67.jpg'},
                {src: 'images/insta pic/SGT-68.jpg'},
                {src: 'images/insta pic/SGT-69.jpg'},
                {src: 'images/insta pic/SGT-70.jpg'},
                {src: 'images/insta pic/SGT-71.jpg'},
                {src: 'images/insta pic/SGT-72.jpg'},
                {src: 'images/insta pic/SGT-73.jpg'},
                {src: 'images/insta pic/SGT-74.jpg'},
                {src: 'images/insta pic/SGT-75.jpg'},
                {src: 'images/insta pic/SGT-76.jpg'},
                {src: 'images/insta pic/SGT-77.jpg'},
                {src: 'images/insta pic/SGT-78.jpg'},
                {src: 'images/insta pic/SGT-79.jpg'},
                {src: 'images/insta pic/SGT-80.jpg'},
                {src: 'images/insta pic/SGT-81.jpg'},
                {src: 'images/insta pic/SGT-82.jpg'}
            ]
        })

        box.addEventListener('click', function () {
            dynamicGallery.openGallery(0);
        });
    })

    box.addEventListener("mouseleave", () => {
        box.classList.remove('active')
    })
})