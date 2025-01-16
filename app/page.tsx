import Form from "./components/Form";

export default function Home() {

  return (
    <div className="flex flex-col justify-center content-center items-center min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-white w-full h-[100vh]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-white md:w-[600px]">
        <h1 className="text-black font-bold text-[30px]">Exchange Currency</h1>
        <Form/>
      </main>
    </div>
  );
}
