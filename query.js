import { query } from 'mu';

export async function queryDatabase(name, description, seller) {
    let filter = '';
    if (name || description || seller) {
        const filterBody = [];
        if (name) {
            filterBody.push(`?name = "${decodeURIComponent(name)}"`);
        }
        if (description) {
            filterBody.push(`?description = "${decodeURIComponent(description)}"`);
        }
        if (seller) {
            filterBody.push(`?seller = "${decodeURIComponent(seller)}"`);
        }
        filter = `FILTER (${filterBody.join(' && ')})`;
    }
    const offeringsQuery = `
    PREFIX gr: <http://purl.org/goodrelations/v1#>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    SELECT ?offering ?product ?currency ?currencyValue ?name ?description ?productName ?productDescription ?pod ?seller ?sellerWebId
    FROM <http://mu.semte.ch/application>
    WHERE {
        ?product a gr:ProductOrService.
        ?offering a gr:Offering.
        ?priceSpecification a gr:PriceSpecification;
            gr:hasCurrency ?currency;
            gr:hasCurrencyValue ?currencyValue.
        ?offering gr:name ?name;
            gr:description ?description;
            gr:includes ?product;
            ext:pod ?pod;
            gr:hasPriceSpecification ?priceSpecification.
        ?product gr:name ?productName;
            gr:description ?productDescription.
        ?sellerEntity a gr:BusinessEntity;
            gr:legalName ?seller;
            gr:description ?sellerWebId;
            gr:offers ?offering.
        ${filter}
    }`;

    return query(offeringsQuery);
}