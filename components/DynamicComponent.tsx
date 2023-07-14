/*
  dynamic으로 import를 하게되면 해당 컴포넌트가 필요할때만 다운로드가 된다. 
*/

console.log("dynamic components");
export default function DynamicComponent() {
  return <div className="">휴대폰 로그인</div>;
}
