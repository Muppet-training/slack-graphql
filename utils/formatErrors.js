import _ from 'lodash';

export default (e, models) => {
	if (e instanceof models.sequelize.ValidationError) {
		// _.pick({a: 1, b: 2}, 'a') => {a:1ƒ}
		return e.errors.map((x) => _.pick(x, [ 'path', 'message' ]));
	}
	return [ { path: 'name', message: e } ];
};
