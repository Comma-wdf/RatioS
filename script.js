var getScore;
(function() {

    window.HEAPF32 = undefined;
    let lastScore = null;
    const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    win.Object.defineProperty(win.Object.prototype, "HEAPF32", {
        get: function() {
            return undefined;
        },
        set: function(to) {
            if (!to || !this.HEAPU32) return;
            delete win.Object.prototype.HEAPF32;
            window.Module = this;
            window.Module.HEAPF32 = to;
            window.HEAPF32 = to;
            monitorScore();
        },
        configurable: true,
        enumerable: true
    });

    function monitorScore() {
        const pattern = [83, 99, 111, 114, 101, 58, 32];
        const patternLength = pattern.length;
        let searchPosition = 0;
        let lastCheckTime = 0;
        const throttleInterval = 16;

        function searchForScore(timestamp) {
            if (timestamp - lastCheckTime < throttleInterval) {
                requestAnimationFrame(searchForScore);
                return;
            }
            lastCheckTime = timestamp;
            if (!window.Module || !window.Module.HEAPU8) {
                requestAnimationFrame(searchForScore);
                return;
            }
            const heapU8 = window.Module.HEAPU8;
            const heapLength = heapU8.length;
            const scanLimit = Math.min(searchPosition + 150000, heapLength - patternLength - 20);
            while (searchPosition < scanLimit) {
                let patternMatch = true;
                for (let i = 0; i < patternLength; i++) {
                    if (heapU8[searchPosition + i] !== pattern[i]) {
                        patternMatch = false;
                        break;
                    }
                }
                if (patternMatch) {
                    let scoreStr = "";
                    let digitPos = searchPosition + patternLength;
                    while (digitPos < heapLength &&
                          ((heapU8[digitPos] >= 48 && heapU8[digitPos] <= 57) || heapU8[digitPos] === 44)) {
                        scoreStr += String.fromCharCode(heapU8[digitPos]);
                        digitPos++;
                    }
                    if (scoreStr.length > 0) {
                        const cleanScoreStr = scoreStr.replace(/,/g, '');
                        getScore = parseInt(cleanScoreStr, 10);
                        if (getScore !== lastScore) {
                            lastScore = getScore;
                            //console.log(`is ${getScore}`);
                        }
                        const foundPosition = searchPosition;
                        searchPosition = scanLimit;
                        setTimeout(() => {
                            searchPosition = Math.max(0, foundPosition - 10);
                        }, throttleInterval);
                        break;
                    }
                }
                searchPosition++;
            }
            if (searchPosition >= heapLength - patternLength - 20) {
                searchPosition = 0;
            }
            requestAnimationFrame(searchForScore);
        }
        requestAnimationFrame(searchForScore);
    }

    function CommaToLetter(num){
        if (num >= 1e6) return (num/1e6).toFixed(1).replace(/\.0$/, '') + 'm';
        if (num >=1e3) return (num/1e3).toFixed(1).replace(/\.0$/, '') + 'k';
        return num.toString();
    }

    function scoreToComma(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

function scoretoletter(num) {
    if (num >= 1_000_000) {
        return num.toString().replace(/(\d{1,3})(\d{6})$/, '$1m');
    }
    return num.toString().replace(/(\d{1,3})(\d{3})$/, '$1k');
}


    addEventListener("DOMContentLoaded", (event) => {
        var GET_REM_VAL;
        var rain = document.createElement('div'), ok = document.createElement('div'), start, once = true, startDate, tool = document.createElement('div'), onetime = true, timeoutId, offsetX, offsetY, canDrag = false, isDragging = false, remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        if(once)console.log("%c Script By Comma ","background-color: #001b3a; color: #fff; border-radius: 0.8rem; padding: 0.8rem 0.8rem; font-size: 0.8rem; font-weight: bold;"); once = false; var trigger = false;
        const target = document.getElementById("home-screen");
        const config = { attributes: true };

        if(GM_getValue('remVal') === undefined){
            GM_setValue('remVal', 2.15);
        } else {
            GET_REM_VAL = GM_getValue('remVal');
        }

        var scoreSave = [];
        let milestones = { reached1: false, reached2: false, reached3: false, reached4: false, reachedscore1: false, reachedscore2: false, reachedscore3: false, reachedscore4: false };
        if (GM_getValue('obj') === undefined){
            var objectt = {
                score1: 100000,
                score2: 500000,
                score3: 1000000,
                score4: 2000000
            };
            GM_setValue('obj', JSON.stringify(objectt));
        }

        var objectusuable = JSON.parse(GM_getValue('obj'))
        var arr_val = Object.values(objectusuable)
        console.log('was',arr_val)
        var arr_val_clone = [...arr_val]

        arr_val_clone.forEach((val, index)=>{
arr_val_clone[index] = scoretoletter(val)})


        Object.keys(milestones).forEach((milestone)=>{
            if(milestone.startsWith('reachedscore')){
                scoreSave.push(milestone);
            }
        });

        const callback = (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'x-state') {
                    const newXStateVal = mutation.target.getAttribute('x-state');

                    if (newXStateVal === 'in-game') {
                        rain.style.display = "block";
                        wdf();
                        startDate = Date.now();
                        const ranbefore = GM_getValue('has_ran', false);
                        ok.textContent = '00:00:00';
                        score1.textContent = `${arr_val_clone[0]} 00:00:00`;
                        score2.textContent = `${arr_val_clone[1]} 00:00:00`;
                        score3.textContent = `${arr_val_clone[2]} 00:00:00`;
                        score4.textContent = `${arr_val_clone[3]} 00:00:00`;
                        scorepm.textContent = '0/min';
                        document.querySelectorAll("[id^='score']").forEach(elemenet => {
                            elemenet.style.display = "block";
                            scorepm.style.display = 'block';
                        });
                        trigger = true;
                        Object.keys(milestones).forEach(key => milestones[key] = false);

                        if (!ranbefore) {
                            extern.inGameNotification(`Pro Ratio Script by Comma#4169 ;)`, 0x001b3a);
                            GM_setValue('has_ran', true);
                        }
                    }

                    if (newXStateVal === 'connecting') {
                        clearInterval(start);
                        ok.textContent = '00:00:00';
                        score1.textContent = `00:00:00`;
                        score2.textContent = '00:00:00';
                        score3.textContent = '00:00:00';
                        score4.textContent = '00:00:00';
                        scorepm.textContent = '0/min';
                        trigger = false;
                    }

                    if (newXStateVal === 'game-over') {
                        clearInterval(start);
                        ok.textContent = '00:00:00';
                    }

                    if (newXStateVal === 'awaiting-spawn') {
                        rain.style.display = "none";
                        mainContainer.style.display = 'none'
                        trigger = false;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(target, config);

        function minimise(){

            var GETT = GM_getValue('remVal');
            rain.style.height = rain.style.height === 'fit-content' ? `${(2.15 / 2.15) * GETT}rem` : 'fit-content';
            rain.style.overflow = rain.style.height === `${(2.15 / 2.15) * GETT}rem` ? 'hidden' : '';
            score1.style.marginBottom = rain.style.overflow === 'hidden' ? '10rem' : '0';
        }

        const containerr = document.createElement('div');
        containerr.style.display = 'flex';
        containerr.style.position = 'absolute';
        containerr.style.top = '0';
        containerr.style.right = '0';
        containerr.style.gap = '0.3rem';

        const img = document.createElement('div');
        img.style.backgroundImage = 'url(https://i.imgur.com/QJphyHB.png)';
        img.style.width = '1rem';
        img.style.height = '1rem';
        img.style.zIndex = '9998';
        img.style.backgroundSize = 'cover';
        img.style.backgroundColor = "transparent";

        const img2 = document.createElement('div');
        img2.style.backgroundImage = 'url(https://i.imgur.com/UqFV8Nt.png)';
        img2.style.width = '1rem';
        img2.style.height = '1rem';
        img2.style.zIndex = '9998';
        img2.style.backgroundSize = 'cover';
        img2.style.backgroundColor = "transparent";

        const img4 = document.createElement('div');
        img4.style.backgroundImage = 'url(https://i.imgur.com/mmZNS0K.png)';
        var GETT = GM_getValue('remVal');
        //console.log(` has ${GETT}`)
        img4.style.height = "1rem"
        img4.style.width = "1rem"
        img4.style.zIndex = '9998';
        img4.style.backgroundSize = 'cover';
        img4.style.backgroundColor = "transparent";
        img4.style.position = 'absolute';
        img4.style.top = '0';
        img4.style.left = '0';
        img4.style.borderRadius = '50%';

        if (GM_getValue('RR') && GM_getValue('RB') === undefined) {
            GM_setValue('RR', 1);
            GM_setValue('RB', 12);
        }

        img4.addEventListener('click', () => {
            if(onetime == true){ onetime = false; extern.inGameNotification(`You can change the projected score/time ratios here`, 0xFF0000, 8000);
            extern.inGameNotification(`Any bugs or problems DM me on discord: Comma#4169`, 0xFFA500, 10000);}
            mainContainer.style.display = (mainContainer.style.display === "none") ? "block" : "none";
        });

        const img3 = document.createElement('div');
        img3.style.backgroundImage = 'url(https://i.imgur.com/2wCXv47.png)';
        img3.style.width = '1rem';
        img3.style.height = '1rem';
        img3.style.zIndex = '9998';
        img3.style.backgroundSize = 'cover';
        img3.style.backgroundColor = "transparent";

        function logic(){
            if(trig){
                 var sort = Object.values(milestones); //make a function to get all values and sort and hide
               if(milestones.reachedscore1){
score1.style.display = 'none'
score2.style.display = 'block'
score3.style.display = 'none'
score4.style.display = 'none'
}
if(milestones.reachedscore2){
score1.style.display = 'none'
score2.style.display = 'none'
score3.style.display = 'block'
score4.style.display = 'none'
}
if(milestones.reachedscore3){
score1.style.display = 'none'
score2.style.display = 'none'
score3.style.display = 'none'
score4.style.display = 'block'
}
            } else {

                score1.style.display = 'block';
                score2.style.display = 'block';
                score3.style.display = 'block';
                score4.style.display = 'block';
            }
        }

        img3.addEventListener('click', () => {
            rain.style.backgroundColor = rain.style.backgroundColor === 'rgba(0, 0, 0, 0)' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0)';
            img.style.display = img.style.display === 'none' ? 'block' : 'none';
            img2.style.display = img2.style.display === 'none' ? 'block' : 'none';
            img4.style.display = img4.style.display === 'none' ? 'block' : 'none';
        });

        var trig = false;
        img2.addEventListener('click', () => {
            minimise();
            scorepm.style.display = trig ? 'block' : 'none';
            trig = !trig;
            logic();

            const rect = rain.getBoundingClientRect();
            const height = window.innerHeight;
            if (rect.bottom > height && Math.abs(rect.bottom - height) > height * 0.045) {
                //console.log("bottom exceed");
                img2.click();
            }
        });

        img.addEventListener("mouseover", () => {
            timeoutId = setTimeout(() => {
                canDrag = true;
                img.style.cursor = "move";
            }, 2000);
        });

        img.addEventListener("mouseleave", () => {
            clearTimeout(timeoutId);
            canDrag = false;
            img.style.cursor = "default";
        });

        img.addEventListener("mousedown", (event) => {
            if (!canDrag) return;

            isDragging = true;
            let rect = rain.getBoundingClientRect();
            offsetX = rect.right - event.clientX;
            offsetY = rect.bottom - event.clientY;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.addEventListener("mousemove", (event) => {
            if (!isDragging) return;
            let rect = rain.getBoundingClientRect();
            let rainWidth = rect.width / remSize;
            let rainHeight = rect.height / remSize;

            let maxRight = (window.innerWidth / remSize) - rainWidth * 0.4;
            let maxBottom = (window.innerHeight / remSize) - rainHeight * 0.4;

            let minRight = -rainWidth * 0.6;
            let minBottom = -rainHeight * 0.6;

            let nr = Math.max(minRight, Math.min((window.innerWidth - event.clientX - offsetX) / remSize, maxRight));
            let nb = Math.max(minBottom, Math.min((window.innerHeight - event.clientY - offsetY) / remSize, maxBottom));

            GM_setValue('RR', nr);
            GM_setValue('RB', nb);

            rain.style.right = `${nr}rem`;
            rain.style.bottom = `${nb}rem`;
        });
        rain.id = 'rai'
        rain.style.display = 'flex';
        rain.style.alignItems = 'center';
        rain.style.justifyContent = 'flex-start';
        rain.style.whiteSpace = 'nowrap';
        rain.style.paddingTop = '1.1rem';
        rain.style.paddingRight = '1.2rem';
        rain.style.paddingBottom = '0.78rem';
        rain.style.paddingLeft = '1.2rem';
        rain.style.display = 'none';
        rain.style.zIndex = '9997';
        rain.style.gap = '0.4rem';
        rain.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        rain.style.fontSize = '1.4rem';
        rain.style.color = '#fff';
        rain.style.width = 'fit-content';
        rain.style.height = 'fit-content';
        rain.style.position = 'absolute';
        const savedRight = GM_getValue('RR', 1);
        const savedBottom = GM_getValue('RB', 12);
        rain.style.right = `${savedRight}rem`;
        rain.style.bottom = `${savedBottom}rem`;
        rain.style.borderRadius = '0.3rem';
        rain.style.textAlign = 'center';
        rain.style.fontFamily = "Arial, Helvetica, sans-serif";
        rain.style.textShadow = '0.05rem 0.05rem 0 #2c2c2c, -0.05rem -0.05rem 0 #2c2c2c, 0.05rem -0.05rem 0 #2c2c2c, -0.05rem 0.05rem 0 #2c2c2c, 0.07rem 0.07rem 0 #2c2c2c, -0.07rem -0.07rem 0 #2c2c2c';

        ok.textContent = '00:00:00';
        ok.style.fontSize = '1rem';
        ok.style.zIndex = '9998';
        var score1 = document.createElement('div');
        console.log('isi', arr_val_clone[0])
        score1.textContent = `${arr_val_clone[0]} 00:00:00`;
        score1.style.fontSize = '0.9rem';
        score1.style.zIndex = '9998';
        var score2 = document.createElement('div');
        score2.textContent = `${arr_val_clone[1]} 00:00:00`;
        score2.style.fontSize = '0.9rem';
        score2.style.zIndex = '9998';
        var score3 = document.createElement('div');
        score3.textContent = `${arr_val_clone[2]} 00:00:00`;
        score3.style.fontSize = '0.9rem';
        score3.style.zIndex = '9998';
        var score4 = document.createElement('div');
        score4.textContent = `${arr_val_clone[3]} 00:00:00`;
        score4.style.fontSize = '0.9rem';
        score4.style.zIndex = '9998';
        var scorepm = document.createElement('div');
        scorepm.textContent = '0/min';
        scorepm.style.fontSize = '0.9rem';
        scorepm.style.zIndex = '9998';

        var scale = document.createElement('div');
        scale.style.position = 'absolute';
        scale.style.display = 'flex';
        scale.style.height = '100vh';
        scale.style.width = '100vw';
        scale.style.zIndex = "9999";
        scale.style.backgroundColor = "transparent";
        scale.style.alignItems = 'center';
        scale.style.justifyContent = "flex-end";
        scale.style.pointerEvents = "none";
        rain.style.pointerEvents = "auto";

        tool.style.width = '0.5rem';
        tool.style.height = '0.5rem';
        tool.style.backgroundColor = '#fff';
        tool.style.zIndex = '9999';

        rain.appendChild(ok);
        rain.appendChild(score1);
        rain.appendChild(score2);
        rain.appendChild(score3);
        rain.appendChild(score4);
        rain.appendChild(scorepm);
        rain.appendChild(img4);
        containerr.appendChild(img3);
        containerr.appendChild(img2);
        containerr.appendChild(img);
        rain.appendChild(containerr);
        scale.appendChild(rain);
        document.body.append(scale);

                         function c(num) {console.log('w',num); let value;


if (getScore >= arr_val[`${num}`]) milestones.reached[`${num}`] = false; milestones[`reachedscore${num}`] = false;

                 }
        function wdf(){
               objectusuable = JSON.parse(GM_getValue('obj'))
        arr_val = Object.values(objectusuable)
        console.log('was',arr_val)
        arr_val_clone = [...arr_val]

        arr_val_clone.forEach((val, index)=>{
arr_val_clone[index] = scoretoletter(val)})

            start = setInterval(function(){
                let currentDate = Date.now();
                let compute = (currentDate - startDate) / 1000;
                let result = Math.floor(compute);

                function formatTime(seconds) {
                    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
                    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
                    const sec = String(seconds % 60).padStart(2, '0');
                    return `${hours}:${minutes}:${sec}`;
                }

                let scorepermin = Math.round(getScore / ((Date.now() - startDate) / 60000));
                scorepm.textContent = `${scorepermin}/min`;

                var time_to_score1 = getScore > 0 ? Math.round(arr_val[0] / (getScore / compute)) : 0;
                var time_to_score2 = getScore > 0 ? Math.round(arr_val[1] / (getScore / compute)) : 0;
                var time_to_score3 = getScore > 0 ? Math.round(arr_val[2] / (getScore / compute)) : 0;
                var time_to_score4 = getScore > 0 ? Math.round(arr_val[3] / (getScore / compute)) : 0;

                 getScore >= arr_val[3] ? (milestones.reached4= true) : null
                 getScore >= arr_val[2] ? (milestones.reached3= true) : null
                 getScore >= arr_val[1] ? (milestones.reached2 = true) : null
                 getScore >= arr_val[0] ? (milestones.reached1 = true) : null;


                if (milestones.reached1 && getScore >= arr_val[0] && milestones.reachedscore1 == false) {
                    milestones.reached1 = false;
                    milestones.reachedscore1 = true;
                   //console.log('1')
                    score1.style.color = '#32CD32';
                    setTimeout(() => { score1.style.color = '#fff'; if(trig)logic(); }, 5000);
                }

                if (milestones.reached2&& getScore >= arr_val[1] && milestones.reachedscore2 == false) {
                    milestones.reached2= false;
                    milestones.reachedscore2 = true;
 //console.log('2')
                    score2.style.color = '#32CD32';
                    setTimeout(() => {score2.style.color = '#fff'; if(trig)logic(); }, 5000);
                }

                if (milestones.reached3&& getScore >= arr_val[2] && milestones.reachedscore3 == false) {
                    milestones.reached3= false;
                    milestones.reachedscore3 = true;
 //console.log('3')
                    score3.style.color = '#32CD32';
                    setTimeout(() => {score3.style.color = '#fff'; if(trig)logic(); }, 5000);
                }

                if (milestones.reached4&& getScore >= arr_val[3] && milestones.reachedscore4 == false) {
                    milestones.reached4= false;
                    milestones.reachedscore4 = true;
 //console.log('4')
                    score4.style.color = '#32CD32';
                    setTimeout(() => { score4.style.color = '#fff'; if(trig)logic(); },5000);
                }

                if(getScore <= arr_val[0]){score1.textContent = `${arr_val_clone[0]} ${formatTime(time_to_score1)}`;}
                if(getScore <= arr_val[1]){score2.textContent = `${arr_val_clone[1]} ${formatTime(time_to_score2)}`;}
                if(getScore <= arr_val[2]){score3.textContent = `${arr_val_clone[2]} ${formatTime(time_to_score3)}`;}
                if(getScore <= arr_val[3]){score4.textContent = `${arr_val_clone[3]} ${formatTime(time_to_score4)}`;}

                ok.textContent = formatTime(result);
            },1000);
        }

        document.addEventListener('keydown', function(event) {
            if ((event.key === 'z' || event.key === 'Z') && trigger) {
                rain.style.display = (rain.style.display === "none") ? "block" : "none";
            }
        });

        const mainContainer = document.createElement('div');
        mainContainer.style.zIndex = '9997';
        mainContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        mainContainer.style.fontSize = '1.4rem';
        mainContainer.style.color = '#fff';
        mainContainer.style.width = '50%';
        mainContainer.style.height = 'fit-content';
        mainContainer.style.borderRadius = '0.3rem';
        mainContainer.style.display = 'none';
        mainContainer.style.pointerEvents = 'auto';
        const overlayContainer = document.createElement('div');
        overlayContainer.style.position = 'absolute';
        overlayContainer.style.display = 'flex';
        overlayContainer.style.height = '100vh';
        overlayContainer.style.width = '100vw';
        overlayContainer.style.zIndex = "9998";
        overlayContainer.style.backgroundColor = "transparent";
        overlayContainer.style.alignItems = 'center';
        overlayContainer.style.justifyContent = "center";
        overlayContainer.style.pointerEvents = "none";
        document.body.appendChild(overlayContainer);

        const headerText = document.createElement('div');
        headerText.style.fontSize = '2rem';
        headerText.textContent = 'Custom Set Time to Score';
        headerText.style.alignSelf = "flex-start";
        headerText.style.textAlign = 'center';
        headerText.style.zIndex = '9998';
        headerText.style.padding = '0.5rem';

        var container = document.createElement('div');
        container.id = 'container';
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.width = "fit-content";
        container.style.margin = "1rem auto";
        document.body.appendChild(container);

        var label = document.createElement('div');
        label.id = 'lbl';
        label.textContent = 'rem: 1';
        label.style.width = "fit-content";
        label.style.height = "fit-content";
        label.style.fontSize = "1.25rem";
        label.style.marginBottom = "1rem";
        label.style.fontWeight = "bold";
        label.style.color = "white";
        container.appendChild(label);

        var bar = document.createElement('div');
        bar.id = 'bar';
        bar.style.position = "relative";
        bar.style.backgroundColor = "red";
        bar.style.width = "12.5rem";
        bar.style.height = "1rem";
        bar.style.borderRadius = "2rem";
        bar.style.overflow = "visible";
        bar.style.display = "flex";
        bar.style.justifyContent = "center";
        bar.style.alignItems = "center";
        container.appendChild(bar);

        var knob = document.createElement('div');
        knob.id = 'knb';
        knob.style.position = "absolute";
        knob.style.width = "0.9375rem";
        knob.style.height = "0.9375rem";
        knob.style.backgroundImage = "url('https://i.imgur.com/vWsRAkE.png')";
        knob.style.backgroundSize = "cover";
        knob.style.backgroundPosition = "center";
        knob.style.borderRadius = "50%";
        knob.style.left = "0";
        bar.appendChild(knob);

        var txt = document.createElement('div');
        txt.id = 'txt';
        txt.textContent = 'Scale';
        txt.style.width = "fit-content";
        txt.style.height = "fit-content";
        txt.style.fontSize = "1rem";
        txt.style.marginTop = "1rem";
        txt.style.color = "rgba(255, 255, 255, 0.7)";
        container.appendChild(txt);

        var drag = false;
        var remList = [];
        for (var i = 1; i <= 7; i += 0.25) remList.push(Number(i.toFixed(2)));
        if (!remList.includes(2.15)) remList.push(2.15);
        remList.sort((a, b) => a - b);

        var savedRemVal = GM_getValue('remVal', 2.15);
        var remIdx = remList.indexOf(savedRemVal);

        function moveKnob() {
            var rem = remList[remIdx];
            var barPos = bar.getBoundingClientRect();
            var maxMove = barPos.width - knob.offsetWidth;
            var posX = ((rem - remList[0]) / (remList[remList.length - 1] - remList[0])) * maxMove;
            knob.style.left = `${posX}px`;
            var lblText = rem === 2.15 ? " (default)" : "";
            label.textContent = `rem: ${rem}${lblText}`;
            GM_setValue('remVal', rem);

            var GETT = GM_getValue('remVal');
            //console.log(` has ${GETT}`)
img4.style.height = img4.style.height = `${(1/ 2.15) * GETT}rem`;
img4.style.width = img4.style.width = `${(1 / 2.15) * GETT}rem`;

img2.style.height = img2.style.height = `${(1/ 2.15) * GETT}rem`;
img2.style.width = img2.style.width = `${(1 / 2.15) * GETT}rem`;

img.style.height = img.style.height = `${(1/ 2.15) * GETT}rem`;
img.style.width = img.style.width = `${(1 / 2.15) * GETT}rem`;

img3.style.height = img3.style.height = `${(1/ 2.15) * GETT}rem`;
img3.style.width = img3.style.width = `${(1 / 2.15) * GETT}rem`;

img4.style.height = img4.style.height = `${(1 / 2.15) * GETT}rem`;
img4.style.width = img4.style.width = `${(1 / 2.15) * GETT}rem`;

img2.style.height = img2.style.height = `${(1 / 2.15) * GETT}rem`;
img2.style.width = img2.style.width = `${(1 / 2.15) * GETT}rem`;

img.style.height = img.style.height = `${(1 / 2.15) * GETT}rem`;
img.style.width = img.style.width = `${(1 / 2.15) * GETT}rem`;

img3.style.height = img3.style.height = `${(1 / 2.15) * GETT}rem`;
img3.style.width = img3.style.width = `${(1 / 2.15) * GETT}rem`;

rain.style.paddingTop = `${(1.1 / 2.15) * GETT}rem`;
rain.style.paddingRight = `${(1.2 / 2.15) * GETT}rem`;
rain.style.paddingBottom = `${(0.78 / 2.15) * GETT}rem`;
rain.style.paddingLeft = `${(1.2 / 2.15) * GETT}rem`;
rain.style.gap = `${(0.4 / 2.15) * GETT}rem`;
rain.style.fontSize = `${(1.4 / 2.15) * GETT}rem`;
rain.style.borderRadius = `${(0.3 / 2.15) * GETT}rem`;

function check() {
//console.log('large')
  if (rain.style.height === 'fit-content') {

    rain.style.height = 'fit-content';
    rain.style.overflow = '0';
    score1.style.marginBottom = '0rem';

  } else {
//console.log('small')
    rain.style.overflow = 'hidden';
    score1.style.marginBottom = '10rem';
      rain.style.height = `${(2.15 / 2.15) * GETT}rem`;
  }
}

check()

ok.style.fontSize = `${(1 / 2.15) * GETT}rem`;
score1.style.fontSize = `${(0.9 / 2.15) * GETT}rem`;
score2.style.fontSize = `${(0.9 / 2.15) * GETT}rem`;
score3.style.fontSize = `${(0.9 / 2.15) * GETT}rem`;
score4.style.fontSize = `${(0.9 / 2.15) * GETT}rem`;
scorepm.style.fontSize = `${(0.9 / 2.15) * GETT}rem`;
containerr.style.gap = `${(0.3 / 2.15) * GETT}rem`;


const shadowV = [
  { x: 0.05, y: 0.05, blur: 0, color: '#2c2c2c' },
  { x: -0.05, y: -0.05, blur: 0, color: '#2c2c2c' },
  { x: 0.05, y: -0.05, blur: 0, color: '#2c2c2c' },
  { x: -0.05, y: 0.05, blur: 0, color: '#2c2c2c' },
  { x: 0.07, y: 0.07, blur: 0, color: '#2c2c2c' },
  { x: -0.07, y: -0.07, blur: 0, color: '#2c2c2c' }
];

const scaledShadow = shadowV
  .map(({ x, y, blur, color }) => {
    const scaledX = (x / 2.15) * GETT;
    const scaledY = (y / 2.15) * GETT;
    const scaledBlur = (blur /2.15) * GETT;
    return `${scaledX}rem ${scaledY}rem ${scaledBlur}rem ${color}`;
  })
  .join(', ');

rain.style.textShadow = scaledShadow;

        }

        knob.addEventListener('mousedown', function() {
            drag = true;

        });

        document.addEventListener('mouseup', function() {
            drag = false;

        });

        knob.addEventListener('mouseover', function() {
            knob.style.cursor = "grabbing";
        });

        document.addEventListener('mousemove', function(event) {
            if (drag) {
                var x = event.clientX;
                var barPos = bar.getBoundingClientRect();
                if (x >= barPos.left && x <= barPos.right) {
                    var step = ((x - barPos.left) / barPos.width) * (remList.length - 1);
                    remIdx = Math.min(Math.max(Math.round(step), 0), remList.length - 1);
                    moveKnob();
                }
            }
        });

        moveKnob();

        const infoText = document.createElement('div');
        infoText.innerHTML = `
<ul style="list-style-type: none; padding: 0;">
    <li style="margin-bottom: 2%;">You can set your <strong>target score</strong> and see how long it will take to reach it.</li>
    <li style="margin-bottom: 2%;">Use the <strong>icons on the ratio script</strong> to <strong>minimize</strong> and <strong>move</strong> it around.</li>
    <li style="margin-bottom: 2%;">Press <strong>Z</strong> to <strong>hide/show</strong> the script.</li>
    <li style="margin-bottom: 2%;">You can use the <strong>scale slider</strong> to change the size of the ratio script.</li>
    <li>If you need help on how to properly use the script, visit this link:<br>
        <a href="https://www.youtube.com/watch?v=PpPsZwZA13g" target="_blank" style="color: #4da6ff;">YouTube Guide</a>
    </li>
</ul>
`;
        infoText.style.fontWeight = 'bold';
        infoText.style.zIndex = '9998';
        infoText.style.position = 'relative';
        infoText.style.bottom = '0';
        infoText.style.fontSize = '1rem';
        infoText.style.height = '40%';
        infoText.style.textAlign = 'center';
        infoText.style.paddingLeft = '10%';
        infoText.style.paddingRight = '10%';
        infoText.style.paddingBottom = '5%';
        infoText.style.paddingTop = '5%';
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.gap = '0.5rem';
        buttonContainer.style.width = '16rem';
        buttonContainer.style.margin = 'auto';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.paddingBottom = '5%';
        buttonContainer.style.paddingTop = '5%';

        document.body.appendChild(buttonContainer);
        var projectedScores = JSON.parse(GM_getValue('obj', null));
        projectedScores = Object.values(projectedScores);

        projectedScores.forEach(function (scr, i) {
         var newScore = scoreToComma(scr);

        projectedScores[i] = newScore
        })

projectedScores.forEach((score, index) => {
    const boxstyle = document.createElement("div");
    Object.assign(boxstyle.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "0.2rem",
        padding: "0.8rem",
        width: "38%",
        height: "1.4rem",
        backgroundColor: "#b4b4b480",
        border: "none",
        whiteSpace: "nowrap",
        cursor: "pointer",
        zIndex: "9998",
        fontSize: "1rem",
        position: "relative",
        pointerEvents: "auto",
    });

            const input = document.createElement('input');
            Object.assign(input.style, {
                position: 'absolute',
                padding: '0.8rem',
                width: '100%',
                height: '100%',
                color: '#fff',
                border: 'none',
                whiteSpace: 'nowrap',
                background: 'transparent',
                pointerEvents: 'auto',
                cursor: 'text',
                zIndex: '9999',
                fontSize: '1rem',
                textAlign: 'center',
                outline: 'none'
            });
            input.value = score;
            input.dataset.index = index;

            input.addEventListener('input', function() {

                this.value = this.value.replace(/\D/g, "");
                var getVal = this.value = scoreToComma(this.value);
                var clean = getVal.replaceAll(',','')
                var getobj = GM_getValue('obj')
                var objectt = JSON.parse(getobj)
                let num = Number(this.dataset.index) + 1
                console.log('is', num);

                objectt[`score${num}`] = clean;
                GM_setValue('obj', JSON.stringify(objectt));

        objectusuable = JSON.parse(GM_getValue('obj'))
        arr_val = Object.values(objectusuable)
        console.log('was',arr_val)
        arr_val_clone = [...arr_val]

        arr_val_clone.forEach((val, index)=>{
arr_val_clone[index] = scoretoletter(val)})
                c(num)

               score1.textContent = `${arr_val_clone[0]} 00:00:00`;
               score2.textContent = `${arr_val_clone[1]} 00:00:00`;
               score3.textContent = `${arr_val_clone[2]} 00:00:00`;
               score4.textContent = `${arr_val_clone[3]} 00:00:00`;
            });

            document.addEventListener('click', (event) => {
                if (!input.contains(event.target)) {
                    input.blur();
                }
            });
            input.addEventListener('click', () => input.focus());
            boxstyle.appendChild(input);
            buttonContainer.appendChild(boxstyle);
        });

        mainContainer.appendChild(headerText);
        mainContainer.appendChild(container);
        mainContainer.appendChild(buttonContainer);
        mainContainer.appendChild(infoText);

        overlayContainer.appendChild(mainContainer);
var ii = 0
        setInterval(() => {
            const rect = rain.getBoundingClientRect();
            const height = window.innerHeight;

            if (rect.top < 0 && Math.abs(rect.top) > height * 0.005) { ii++;
                //console.log("top exceed");
                img2.click();
                                                                      //console.log(`${ii}`)
                if(ii >= 3){
             GM_setValue('RRR', 1);
             GM_setValue('RBB', 12);

             var nr = GM_getValue('RRR');
             var nb = GM_getValue('RBB');
//console.log(`${nr}${nb}`)
            rain.style.right = `${nr}rem`;
            rain.style.bottom = `${nb}rem`;
                    ii = 0
                }
            }
        }, 1000);
    });
})();
