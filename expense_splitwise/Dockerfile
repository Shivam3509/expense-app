FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# ✅ Copy the full project before running collectstatic
COPY . /app/

# ✅ Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "expense_splitwise.wsgi:application", "--bind", "0.0.0.0:8000"]
