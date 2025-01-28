const Persons = ({persons}) => {
    return (
        <div key={persons.id}>
            {persons}
        </div>
    )
}

export default Persons