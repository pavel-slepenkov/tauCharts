import {BaseScale} from './base';
import {utils} from '../utils/utils';
/* jshint ignore:start */
import {default as d3} from 'd3';
/* jshint ignore:end */

export class LinearScale extends BaseScale {

    constructor(xSource, scaleConfig) {

        super(xSource, scaleConfig);

        var props = this.scaleConfig;
        var vars = d3.extent(this.vars);

        var min = Number.isFinite(props.min) ? props.min : vars[0];
        var max = Number.isFinite(props.max) ? props.max : vars[1];

        vars = [
            Math.min(...[min, vars[0]].filter(Number.isFinite)),
            Math.max(...[max, vars[1]].filter(Number.isFinite))
        ];

        this.vars = (props.nice) ? utils.niceZeroBased(vars) : d3.extent(vars);

        this.addField('scaleType', 'linear')
            .addField('discrete', false);
    }

    isInDomain(x) {
        var domain = this.domain();
        var min = domain[0];
        var max = domain[domain.length - 1];
        return (!Number.isNaN(min) && !Number.isNaN(max) && (x <= max) && (x >= min));
    }

    create(interval) {

        var varSet = this.vars;

        var d3Domain = d3.scale.linear().domain(varSet);

        var d3Scale = d3Domain.rangeRound(interval, 1);
        var scale = (int) => {
            var min = varSet[0];
            var max = varSet[1];
            var x = int;
            if (x > max) {
                x = max;
            }
            if (x < min) {
                x = min;
            }

            return d3Scale(x);
        };

        // have to copy properties since d3 produce Function with methods
        Object.keys(d3Scale).forEach((p) => (scale[p] = d3Scale[p]));

        scale.stepSize = (() => 0);

        return this.toBaseScale(scale, interval);
    }
}