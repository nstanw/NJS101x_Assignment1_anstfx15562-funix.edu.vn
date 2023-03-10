import {action, observable} from 'mobx'
import ViewPhienLamViec from '../Dtos/phienLamViec/phienlamviecDto';
import TableResult from '../Dtos/TableResult';

class PhienLamViec {
@observable  PhienLamViec = new TableResult<ViewPhienLamViec>()
}