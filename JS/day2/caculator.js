function start() {
  // 1. 사용자에게 계산식 입력받기
  const input = prompt("계산식을 입력하세요.(예: 1 + 1 * 4)");

  // 취소 버튼을 눌렀거나 빈 값을 입력한 경우 종료
  if (input === null || input.trim() === "") {
    console.log("계산이 취소되었습니다.");
    return;
  }

  // 공백 제거 (예: "1 + 2 * 3" -> "1+2*3")
  const expression = input.replace(/\s+/g, "");

  // 2. 숫자와 연산자 분리하기
  // 숫자와 연산자(+, -, *, /)만 허용하는지 검증
  if (!/^[0-9+\-*/.]+$/.test(expression)) {
    console.log("잘못된 입력입니다. 숫자와 사칙연산자(+, -, *, /)만 입력해주세요.");
    return;
  }

  // 정규표현식을 이용해 숫자와 연산자를 배열로 분리 (예: ["1", "+", "2", "+", "3", "*", "5", "+", "6", "/", "3"])
  const tokens = expression.match(/(\d+\.?\d*|\.\d+|[+\-*/])/g);

  if (!tokens || tokens.length < 3) {
    console.log("올바른 계산식을 입력해주세요.");
    return;
  }

  // 3. [1단계 우선순위] 곱셈(*)과 나눗셈(/) 먼저 처리
  const firstPass = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token === "*" || token === "/") {
      const prevNum = parseFloat(firstPass.pop()); // 직전에 넣은 숫자 꺼내기
      const nextNum = parseFloat(tokens[i + 1]);   // 연산자 뒤의 숫자

      if (isNaN(prevNum) || isNaN(nextNum)) {
        console.log("수식 오류가 발생했습니다. 연산자 위치를 확인해주세요.");
        return;
      }

      if (token === "/" && nextNum === 0) {
        console.log("0으로 나눌 수 없습니다.");
        return;
      }

      const calcResult = token === "*" ? prevNum * nextNum : prevNum / nextNum;
      firstPass.push(calcResult);
      i += 2; // 연산자와 뒤의 숫자를 모두 처리했으므로 인덱스 2칸 이동
    } else {
      firstPass.push(token);
      i++;
    }
  }

  // 4. [2단계 우선순위] 덧셈(+)과 뺄셈(-) 처리
  let finalResult = parseFloat(firstPass[0]);

  for (let j = 1; j < firstPass.length; j += 2) {
    const operator = firstPass[j];
    const nextNum = parseFloat(firstPass[j + 1]);

    if (isNaN(nextNum)) {
      console.log("수식 오류가 발생했습니다.");
      return;
    }

    if (operator === "+") {
      finalResult += nextNum;
    } else if (operator === "-") {
      finalResult -= nextNum;
    }
  }

  // 5. 콘솔창에 결과 출력
  console.log(`입력한 수식: ${input}`);
  console.log(`계산 결과: ${finalResult}`);
}