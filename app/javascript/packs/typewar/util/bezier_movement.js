// Solution found on: 
// http://answers.unity3d.com/questions/12689/moving-an-object-along-a-bezier-curve.html
// Will adapt this for my needs once we come up with some bezier paths for 
// projectiles

//var StartPointX: float = 0;
//var StartPointY: float = 0;
//var ControlPointX: float = 20;
//var ControlPointY: float = 50;
//var EndPointX : float = 50;
//var EndPointY : float = 0;
//var CurveX:float;
//var CurveY: float;
//var BezierTime: float = 0;
//var mySphere: Transform;
//
//function Update()
//{
//    BezierTime = BezierTime + Time.deltaTime;
//
//    if (BezierTime &gt;= 1)
//    {
//        BezierTime = 0;
//    }
//
//    CurveX = (((1-BezierTime)*(1-BezierTime)) * StartPointX) + (2 * BezierTime * (1 - BezierTime) * ControlPointX) + ((BezierTime * BezierTime) * EndPointX);
//    CurveY = (((1-BezierTime)*(1-BezierTime)) * StartPointY) + (2 * BezierTime * (1 - BezierTime) * ControlPointY) + ((BezierTime * BezierTime) * EndPointY);
//    transform.position = Vector3(CurveX, CurveY, 0);
//
//}
