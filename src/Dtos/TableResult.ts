import { PageResultTotalDto } from "./PageResultTotalDto";
import { IFilterDto } from "./IFilterDto";

class TableResult<T> {
    result: number = 20;
    sizePage: number= 0;
    filter: string = "";
    filter0: IFilterDto[] =  [];
    q: string = "";
    test: string = '';
    isLoading: boolean = true;
} ;

export default TableResult;