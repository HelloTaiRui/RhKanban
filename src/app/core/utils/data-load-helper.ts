export class DataLoadHelper {



    static loadArrData(src: any[], dst: any[], segmentSize: number = 200) {
        let loadData = (data: any[], start: number, size: number) => {
            if (start > data.length) {
                return;
            }
            dst.push(...data.slice(start, start + size));
            start += size;
            setTimeout(() => { loadData(data, start, size) }, 100);
        }
        loadData(src, 0, segmentSize);
    }

}