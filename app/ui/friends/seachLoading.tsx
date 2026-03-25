import Spinner from "../spinner";

export function SeachLoading() {
	return (
	  <div className="flex items-center gap-2 text-muted-foreground">
		 <Spinner />
		 <span>Поиск...</span>
	  </div>
	);
 }