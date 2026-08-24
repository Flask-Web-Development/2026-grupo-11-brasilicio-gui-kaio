export default function Header(){
  return(
    <div className="bg-emerald-500 h-full grid grid-cols-3 px-4">
      <div className="flex justify-start items-center">
        <img src="https://www.gov.br/participamaisbrasil/blob/ver/17216?w=0&h=0" alt="" className="size-20 bg-white rounded-2xl shadow-xl"/>
      </div>
      <div className="flex">

      </div>
      <div className="flex justify-end items-center">
        <h1 className="text-4xl font-bold">Blog IF-PAR</h1>
        <hr/>
      </div>
    </div>
  );
}