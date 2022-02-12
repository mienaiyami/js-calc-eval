const input = document.querySelector("#displayInput");
input.value = "";
const numBtn = $(".num-btn");
const operatorBtn = $(".ope-btn");

const Del = $("#calc-del");
const Reset = $("#calc-reset");
const Enter = $("#calc-enter");
$(".header .showHide").on("click", () => {
    $(".history").addClass("open");
    $(".history").removeClass("close");
});
$(".history .closeBtn").on("click", () => {
    $(".history").addClass("close");
    input.focus();
    $(".history").removeClass("open");
});
const history = JSON.parse(localStorage.getItem("history")) || [];
const updateHistory = (history) => {
    localStorage.setItem("history", JSON.stringify(history));
    let list = "";
    history.forEach((e) => {
        list += `<li>${e}</li>`;
    });
    $(".history .list ul").html(list);
};
updateHistory(history);
const solArray = [];

const factorial = (num) => {
    num = parseFloat(num);
    if (num === 0) return 1;
    if (num < 0) return alert("Invalid factorial input");
    let fact = 1;
    for (let i = 1; i <= num; i++) {
        fact *= i;
    }
    return fact;
};
const solve = (rawValue) => {
    if (/(\(|\))/gi.test(rawValue)) {
        rawValue = rawValue.replace(")(", ")*(");
        rawValue = rawValue.replace(/((?<=\d)\()/gi, "*(");
        rawValue = rawValue.replace(/(\)(?=\d))/gi, ")*");
        return eval(rawValue);
    } else return eval(rawValue);
};
const doCalc = () => {
    let calc = 0;
    let rawValue = input.value.replace(/ +/gi, "");
    if (rawValue.charAt(0) === "-") rawValue = 0 + rawValue;
    if (/(\+|\-|\*|\/|\.|\^|\%)/gi.test(rawValue[rawValue.length - 1]))
        rawValue = rawValue.substr(0, rawValue.length - 1);
    rawValue = rawValue.replace(/-/gi, "+-");
    while (rawValue.includes("!")) {
        let f = rawValue.replace(/(\d+|(\(\S+\)))!/gi, "$");
        let x = rawValue.match(/(\d+|(\(\S+\)))!/gi);
        x.forEach((e) => {
            e = e.replace("!", "");
            e = "(factorial(" + e + "))";
            f = f.replace("$", e);
        });
        rawValue = f;
    }
    rawValue = rawValue.replaceAll("^", "**");
    calc = parseFloat(solve(rawValue));
    if (calc == undefined || isNaN(calc)) calc = 0;
    history.unshift(input.value + " = " + calc);
    updateHistory(history);
    input.value = calc;
};
const addToInput = (i, pos) => {
    let x = input.value;
    let regex = /(\+|\-|\*|\/|\.|\^|\%|\!)/;
    const countBracket = (string, type) => {
        let count = 0;
        for (let i = 0; i < x.length; i++) {
            if (string[i] === type) count++;
        }
        return count;
    };
    if (
        i === ")" &&
        countBracket(x, "(") < countBracket(x.slice(0, pos), ")") + 1
    ) {
        return;
    }
    if (regex.test(i)) {
        if (x.includes(".") && i === ".") return;
        if (regex.test(x.charAt(pos - 1)) && x.charAt(pos - 1) !== "!") {
            if (x.length === 1) return;
            input.value = x.substring(0, x.length - 1) + i;
            return;
        }
    }
    if (x == "" && /(\+|\*|\/|\.|\^|\%|\!)/gi.test(i)) {
        return;
    }
    input.setSelectionRange(pos, pos);
    input.value = x.substr(0, pos) + i + x.substr(pos, x.length);
    input.setSelectionRange(pos + 1, pos + 1);
};
const btnClicks = () => {
    numBtn.on("click", (e) => {
        addToInput($(e.target).attr("data-value"), input.selectionStart);
    });

    operatorBtn.on("click", (e) => {
        addToInput($(e.target).attr("data-value"), input.selectionStart);
    });

    Del.on("click", () => {
        let x = input.value;
        input.value = x.substring(0, x.length - 1);
    });
    Reset.on("click", () => {
        input.value = "";
    });
    Enter.on("click", () => {
        if (/(\*|\/|\-|\+|\.|\^|\!|\%|(\((.*)\)))/gi.test(input.value)) {
            doCalc();
        }
    });
};
btnClicks();
const keyClicks = (e) => {
    if (e.key == "Backspace") {
        Del.click();
        return;
    }
    if (input.value.length >= 25) return;
    if (e.ctrlKey && e.key === "a") {
        input.select();
        return;
    }
    let pos = input.selectionStart ?? input.value.length;
    if (e.key == "Enter" || e.key === "=") {
        Enter.click();
        return;
    }
    if (e.key.length === 1) {
        if (/((?<!f)([0-9]|\*|\/|\-|\+|\.|\,|\^|\(|\)|\%|\!))/gi.test(e.key)) {
            if (
                input.selectionEnd - input.selectionStart ===
                input.value.length
            )
                input.value = "";
            addToInput(e.key, pos);
            return;
        }
    }
};
document.onreadystatechange = () => {
    input.focus();
};
document.onmousedown = () => {
    input.focus();
};
document.onkeydown = (e) => {
    if (e.key === "Escape") {
        return $(".history .closeBtn").click();
    }
    if (document.activeElement !== input) {
        keyClicks(e);
    }
};
input.ondrag = (e) => {
    e.preventDefault();
};
input.onkeypress = (e) => {
    e.preventDefault();
    keyClicks(e);
};

input.onblur = () => {
    if ($(".history").hasClass("close")) input.focus();
};
