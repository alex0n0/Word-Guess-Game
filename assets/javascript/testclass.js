class TestClass {
    constructor() {
        this.a = 3;
    }
    printstuff() {
        console.log('does this work? YES!!');
    }

    changetext(p_element) {
        p_element.innerHTML = `${parseInt(Math.random() * 100)}`;
    }
}

export default TestClass;
