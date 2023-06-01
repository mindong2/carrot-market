import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    // space-y-5 -> helper function flex 자식들에게 y축에 5만큼 margin 넣어줌, gap-5도 가능
    <div className=" m-auto flex min-h-screen flex-col space-y-5 bg-slate-400 px-10 py-20" style={{ maxWidth: "560px", margin: "0 auto" }}>
      {/* Receipt */}
      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <span className="text-3xl font-bold">Select Item</span>
        <ul>
          {[1, 2, 3, 4, ""].map((i) => (
            <li key={i} className="my-3 flex justify-between py-1 odd:bg-blue-200 even:bg-red-200 empty:hidden">
              <span className="font-semibold text-gray-500">Grey chair</span>
              <span className="font-semibold">$19</span>
            </li>
          ))}
        </ul>

        {/* <div className="flex justify-between">
          <span className="font-semibold text-red-500">red chair</span>
          <span className="font-semibold">$19</span>
        </div> */}

        <div className="mt-3 flex items-center justify-between border-t-2 border-dashed pt-2">
          <span className="text-lg font-semibold">Total</span>
          <span className="font-semibold">$38</span>
        </div>

        <div className="mx-auto mt-5 w-1/2 cursor-pointer rounded-xl bg-blue-500 py-3 text-center font-semibold text-white">Check out!</div>
      </div>
      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between bg-blue-500 p-8">
          <span className="text-2xl font-semibold text-white">Profile</span>
          <span>logo</span>
        </div>
        <div className="group relative -top-3 flex justify-between rounded-2xl bg-white p-8">
          <div className="flex flex-col items-center gap-y-1">
            <span className="text-xl font-medium">Order</span>
            <span>$123</span>
          </div>
          <div className="-mt-20 flex flex-col items-center">
            <img
              src="data:image/jpeg;base64,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"
              className="mg-auto h-24 w-24 rounded-full bg-red-500 transition group-hover:-translate-y-2"
            />
            <div className="flex flex-col items-center gap-y-2">
              <span className="text-2xl font-bold">Dongmin2</span>
              <span>한국</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-1">
            <span className="text-xl font-medium">Spent</span>
            <span>$22</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer">◀</div>
          <div className="flex items-center space-x-2">
            <span className="rounded-md p-2 shadow-lg">★</span>
            <span className="font-semibold">4.9</span>
            <span className="rounded-md p-2 shadow-lg">❤</span>
          </div>
        </div>
        <div className="m-auto w-40">
          <img className="w-full" src="https://i.ibb.co/5963kz8/chair.jpg" alt="" />
        </div>
        <h3 className="mb-1 mt-2 text-3xl font-bold">Swoon Lounge</h3>
        <span className="text-gray-500">Chair</span>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-x-3">
            <button className="h-5 w-5 rounded-full bg-yellow-500 ring-yellow-500 ring-offset-2 transition focus:ring-2"></button>
            <button className="h-5 w-5 rounded-full  bg-indigo-500 ring-indigo-500 ring-offset-2 transition focus:ring-2"></button>
            <button className="h-5 w-5 rounded-full bg-teal-500 ring-teal-500 ring-offset-2 transition focus:ring-2"></button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setCount((prev) => (prev !== 0 ? prev - 1 : 0));
              }}
              className="flex aspect-square w-10 items-center justify-center rounded-lg bg-blue-200 text-xl"
            >
              -
            </button>
            <span>{count}</span>
            <button
              onClick={() => {
                setCount((prev) => prev + 1);
              }}
              className="flex aspect-square w-10 items-center justify-center rounded-lg bg-blue-200 text-xl"
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-3xl font-bold">$450</span>
          <button className="rounded-md bg-blue-500 px-10 py-3 font-semibold text-white">Add to Cart</button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-10 shadow-xl">
        <form>
          {/* 
            peer -> 뒤에오는 형제들 선택자
            * invalid 속성은 required가 있어야 한다
           */}
          <input type="text" required className="peer border-2 border-gray-500" />
          <span className="hidden text-red-300 peer-invalid:block">내용을 입력해주세요.</span>
          <span className="hidden text-teal-300 peer-valid:block">Awesome!</span>
          <input type="submit" className="cursor-pointer border-2 border-gray-500" />
        </form>
      </div>
    </div>
  );
}
