const Showlist = ({ showperson, deletethis }) => (
  <li>
    {showperson.name} {showperson.number} <button onClick={deletethis}>delete</button>
  </li>
);

export default Showlist;