export default function Errors(props) {
  const { errorInView } = props;

  return (
    <>
      <div className="error-message">{errorInView}</div>
    </>
  );
}
