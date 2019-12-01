
const randDatetime = () =>
  dayjs()
    .subtract(Math.floor(Math.random() * 60), "day")
    .format("YYYY-M-D H:mm:ss");

const recipes = [
  {
    id: 1,
    title: "ペペロンチーノ",
    cookTime: 10,
    cost: 200,
    createdAt: randDatetime(),
    updatedAt: randDatetime(),
    ingredients: ["にんにく","唐辛子","オリーブオイル"],
    directions: ["オリーブいれる","にんにく炒める","パスタいれる"],
    user: 1,
  },
  {
    id: 2,
    title: "マルゲリータ",
    cookTime: 30,
    cost: 500,
    createdAt: randDatetime(),
    updatedAt: randDatetime(),
    ingredients: ["チーズ","トマトソース","小麦粉"],
    directions: ["小麦粉こねる","トマトソースいれる","チーズいれる","焼く"],
    user: 1,
  },
  {
    id: 3,
    title: "カルボナーラ",
    cookTime: 20,
    cost: 400,
    createdAt: randDatetime(),
    updatedAt: randDatetime(),
    ingredients: ["タマゴ","チーズ","にんにく"],
    directions: ["パスタ茹でる","チーズとタマゴいれる"],
    user: 1,
  },
  {
    id: 4,
    title: "アラビアータ",
    cookTime: 15,
    cost: 150,
    createdAt: randDatetime(),
    updatedAt: randDatetime(),
    ingredients: ["にんにく","トマトソース","唐辛子"],
    directions: ["パスタ茹でる","唐辛子とにんにくいれる"],
    user: 2,
  },
  {
    id: 5,
    title: "カプレーゼ",
    cookTime: 5,
    cost: 300,
    createdAt: randDatetime(),
    updatedAt: randDatetime(),
    ingredients: ["トマト","チーズ","バジル"],
    directions: ["チーズをカットする","トマトとチーズをあえる","バジルいれる"],
    user: 3,
  },
];

const users = [
  {
    id: 1,
    name: "松岡翔",
    bio: "イタリア料理が好きです。",
    mail: "smatsuoka@gmail.com",
    pass: "password",
    account: "smatsuoka"
  },
  {
    id: 2,
    name: "田中雄一",
    bio: "ロシア料理が好きです。",
    mail: "ytanaka@gmail.com",
    pass: "password",
    account: "ytanaka"
  },
  {
    id: 3,
    name: "中村優樹",
    bio: "韓国料理が好きです。",
    mail: "ynakamura@gmail.com",
    pass: "password",
    account: "ynakamura"
  },
  {
    id: 4,
    name: "五十嵐龍",
    bio: "中華料理が好きです。",
    mail: "rigarashi@gmail.com",
    pass: "password",
    account: "rigarashi"
  },
  {
    id: 5,
    name: "長谷川余市",
    bio: "日本食が大好き。",
    mail: "yhasegawa@gmail.com",
    pass: "password",
    account: "yhasegawa"
  },
];

const stars = [
  {
    id: 1,
    recipe: 4,
    user: 1,
  },
  {
    id: 2,
    recipe: 5,
    user: 1,
  },
  {
    id: 3,
    recipe: 1,
    user: 2,
  },
  {
    id: 4,
    recipe: 1,
    user: 4,
  },
  {
    id: 5,
    recipe: 1,
    user: 5,
  },
]
exports.seed = function(knex) {
  
  // Deletes ALL existing entries
  return knex("table_name")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("table_name").insert([
        { id: 1, colName: "rowValue1" },
        { id: 2, colName: "rowValue2" },
        { id: 3, colName: "rowValue3" }
      ]);
    });
};
