import qwest from 'qwest';
const TicketsModel = {
    getTickets: (params) => {
        let url = `/v1/getTickets?leftTicketDTO.train_date=${params.train_date}`
            + `&leftTicketDTO.from_station=${params.from_station}`
            + `&leftTicketDTO.to_station=${params.to_station}&purpose_codes=${params.purpose_codes}`
        return qwest.get(url, null, {
            responseType: 'json'
        });
    },
    getTicketPrice: () => {
        return qwest.get('/v1/getTicketPrice', {
            responseType: 'json'
        });
    },
    getStation: () => {
        return qwest.get('/v1/station', {
            responseType: 'json'
        });
    }
}
export default TicketsModel;