import React, { useMemo, useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "8px 11px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, outline: "none" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const tabBtn = { background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", fontSize: 11.5, padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };

const OPS = ["$eq","$ne","$gt","$gte","$lt","$lte","$in","$nin","$exists","$regex"];

export default function MongoQueryBuilder() {
  const [collection, setCollection] = useState("users");
  const [action, setAction] = useState("find");
  const [filters, setFilters] = useState([{ field: "status", op: "$eq", value: "active" }]);
  const [projection, setProjection] = useState("name, email, createdAt");
  const [sort, setSort] = useState("createdAt: -1");
  const [limit, setLimit] = useState("10");

  const addFilter = () => setFilters(f => [...f, { field: "", op: "$eq", value: "" }]);
  const updFilter = (i, k, v) => setFilters(f => f.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const delFilter = (i) => setFilters(f => f.filter((_, j) => j !== i));

  const query = useMemo(() => {
    const filterObj = {};
    filters.forEach(({ field, op, value }) => {
      if (!field) return;
      let parsed = value;
      if (value === "true") parsed = true;
      else if (value === "false") parsed = false;
      else if (!isNaN(Number(value)) && value !== "") parsed = Number(value);
      if (op === "$eq") filterObj[field] = parsed;
      else filterObj[field] = { [op]: parsed };
    });

    const projObj = {};
    projection.split(",").map(s => s.trim()).filter(Boolean).forEach(f => { projObj[f] = 1; });

    const sortObj = {};
    sort.split(",").map(s => s.trim()).filter(Boolean).forEach(s => {
      const [k, v] = s.split(":").map(x => x.trim());
      if (k) sortObj[k] = parseInt(v) || 1;
    });

    const lim = parseInt(limit) || 10;

    if (action === "find") {
      return `db.${collection}.find(\n  ${JSON.stringify(filterObj, null, 2)},\n  ${JSON.stringify(projObj, null, 2)}\n).sort(${JSON.stringify(sortObj)}).limit(${lim})`;
    }
    if (action === "count") return `db.${collection}.countDocuments(\n  ${JSON.stringify(filterObj, null, 2)}\n)`;
    if (action === "deleteMany") return `db.${collection}.deleteMany(\n  ${JSON.stringify(filterObj, null, 2)}\n)`;
    if (action === "aggregate") {
      const pipeline = [];
      if (Object.keys(filterObj).length) pipeline.push({ $match: filterObj });
      if (Object.keys(sortObj).length) pipeline.push({ $sort: sortObj });
      pipeline.push({ $limit: lim });
      return `db.${collection}.aggregate(${JSON.stringify(pipeline, null, 2)})`;
    }
    return "";
  }, [collection, action, filters, projection, sort, limit]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
        <div>
          <label style={fieldLabel}>Collection</label>
          <input style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} value={collection} onChange={e => setCollection(e.target.value)} placeholder="users" />
        </div>
        <div>
          <label style={fieldLabel}>Action</label>
          <div style={{ display: "flex", gap: 6 }}>
            {["find","count","deleteMany","aggregate"].map(a => (
              <button key={a} onClick={() => setAction(a)} style={{ ...tabBtn, ...(action===a?tabBtnActive:{}) }}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      <label style={fieldLabel}>Filters</label>
      {filters.map((f, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <input style={{ ...inputStyle, flex: 2 }} value={f.field} onChange={e => updFilter(i,"field",e.target.value)} placeholder="field" />
          <select style={{ ...inputStyle, flex: 1.5 }} value={f.op} onChange={e => updFilter(i,"op",e.target.value)}>
            {OPS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <input style={{ ...inputStyle, flex: 2 }} value={f.value} onChange={e => updFilter(i,"value",e.target.value)} placeholder="value" />
          <button onClick={() => delFilter(i)} style={{ color: "#FF6B6B", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      ))}
      <button onClick={addFilter} style={{ fontSize: 12, color: "#7C5CFF", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>+ Add filter</button>

      {action === "find" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={fieldLabel}>Projection (comma separated)</label>
            <input style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} value={projection} onChange={e => setProjection(e.target.value)} placeholder="name, email" />
          </div>
          <div>
            <label style={fieldLabel}>Sort (field: 1 or -1)</label>
            <input style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} value={sort} onChange={e => setSort(e.target.value)} placeholder="createdAt: -1" />
          </div>
          <div>
            <label style={fieldLabel}>Limit</label>
            <input style={{ ...inputStyle, width: 70 }} value={limit} onChange={e => setLimit(e.target.value)} type="number" min={1} />
          </div>
        </div>
      )}

      <OutputBar value={query} label="MongoDB query" />
    </div>
  );
}
