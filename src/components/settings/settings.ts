export const TargetServer = "http://127.0.0.1:8000/"

export function numberWithCommas(x:string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}