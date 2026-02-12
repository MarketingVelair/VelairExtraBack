
const fields = ['name', 'cpf', 'address', 'state', 'city', 'rg', 'id_emitter', 'id_emission_date', 'postalCode', 'sex', 'phone', 'nationality', 'naturalization', 'canac']
const tableName = "instructor";
const payload = {
    "data": {
        [tableName]: [
            {
                "action": "INSERT",
                "fields": fields.map(f => {
                    return {
                        "field_name": f,
                        "value": "MOCK_DATA",
                        "date": new Date().toISOString()
                    }
                })
            }
        ]
    }
}
console.log(JSON.stringify(payload))