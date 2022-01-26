from typing import List, Any, TypeVar, Callable, Type, cast


T = TypeVar("T")


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


class Chart:
    order1: int
    order2: int
    describe: str
    x_name: str
    y_name: str
    chart: str
    classify: List[Any]
    x_data: List[List[str]]
    y_data: List[List[int]]

    def __init__(
        self,
        order1: int,
        order2: int,
        describe: str,
        x_name: str,
        y_name: str,
        chart: str,
        classify: List[Any],
        x_data: List[List[str]],
        y_data: List[List[int]],
    ) -> None:
        self.order1 = order1
        self.order2 = order2
        self.describe = describe
        self.x_name = x_name
        self.y_name = y_name
        self.chart = chart
        self.classify = classify
        self.x_data = x_data
        self.y_data = y_data

    @staticmethod
    def from_dict(obj: Any) -> "Chart":
        assert isinstance(obj, dict)
        order1 = obj.get("order1")
        order2 = obj.get("order2")
        describe = obj.get("describe")
        x_name = obj.get("x_name")
        y_name = obj.get("y_name")
        chart = obj.get("chart")
        classify = obj.get("classify")
        x_data = obj.get("x_data")
        y_data = obj.get("y_data")
        return Chart(
            order1, order2, describe, x_name, y_name, chart, classify, x_data, y_data
        )

    def to_dict(self) -> dict:
        result: dict = {}
        result["order1"] = self.order1
        result["order2"] = self.order2
        result["describe"] = self.describe
        result["x_name"] = self.x_name
        result["y_name"] = self.y_name
        result["chart"] = self.chart
        result["classify"] = self.classify
        result["x_data"] = self.x_data
        result["y_data"] = self.y_data
        return result


def Chart_from_dict(s: Any) -> Chart:
    return Chart.from_dict(s)


def Chart_to_dict(x: Chart) -> Any:
    return to_class(Chart, x)
