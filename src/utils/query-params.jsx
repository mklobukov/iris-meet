//
//  Get the value of a query in URL
//  @param  {String} field The field to get the value of
//  @param  {String} url   The URL to get the value from (optional)
//  @return {String}       The field value
//
export default function(field, url) {
    const href = url ? url : window.location.href;
    const reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    let string = reg.exec(href);
    return string ? string[1] : null;
};
