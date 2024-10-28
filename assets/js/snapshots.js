const SNAPSHOTS = [
    {
        image: "./assets/images/focused-student-doing-active-recall-studying-on-laptop.jpeg",
        tagline: "Study smarter, more effectively and improve active recall"
    },
    {
        image: "./assets/images/focused-student-doing-active-recall-studying-on-laptop.jpeg",
        tagline: "Set yourself on the path to academic excellence."
    },
    {
        image: "./assets/images/happy-students-pass-exams.jpeg",
        tagline: "Increase your productivity while you study."
    },
    {
        image: "./assets/images/happy-students-pass-exams.jpeg",
        tagline: "Study smarter, more effectively and improve recall"
    }
]

function RENDER_SHAPSHOTS(snapshots) {
    snapshots.map((snapshot, ind) => {
        document.querySelector("#snapshots_list").innerHTML += `
            <li>
                <div class="snapshot_card">
                    <img src=${snapshot.image} width=""/>
                    <p class="snapshot_text">${snapshot.tagline}</p>
                </div>
            </li>
        `
    });
}

RENDER_SHAPSHOTS(SNAPSHOTS);