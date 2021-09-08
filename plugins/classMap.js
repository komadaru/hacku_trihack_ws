// 名前とクラスの対応関係
// （投票の際に特定の名前の選択肢に特定の値を割り当てるため）

const classMap = new Map([
    ["賛成", "agree"],
    ["反対", "disagree"],
    ["肯定", "agree"],
    ["否定", "disagree"],
])

export default classMap